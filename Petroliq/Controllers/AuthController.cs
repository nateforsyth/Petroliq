using Microsoft.AspNetCore.Mvc;
using Petroliq_API.Services;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Petroliq_API.Authorisation;
using Petroliq_API.Model;
using MongoDB.Driver.Linq;
using Microsoft.AspNetCore.Identity;
using Amazon.Auth.AccessControlPolicy;
using Newtonsoft.Json.Linq;
using Petroliq_API.Model.ControllerModels;

namespace Petroliq_API.Controllers
{
    /// <summary>
    /// Authentication Controller
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserService _userService;
        private readonly IOptions<AuthSettings> _authSettings;

        private readonly string _jwtAuthKey = string.Empty;
        private readonly string _jwtIssuer = string.Empty;
        private readonly string _jwtAudience = string.Empty;
        private readonly int _refreshTokenValiditityDays = -1;
        private readonly int _tokenValidityMinutes = -1;

        /// <summary>
        /// Authentication Controller
        /// </summary>
        /// <param name="configuration"></param>
        /// <param name="userService"></param>
        /// <param name="authSettings"></param>
        public AuthController(IConfiguration configuration, UserService userService, IOptions<AuthSettings> authSettings)
        {
            _authSettings = authSettings;
            _configuration = configuration;
            _userService = userService;

#if !DEBUG
             _jwtAuthKey = _configuration["Auth:Key"]; // authSettings.Value.Key; // from appsettings.json, for IIS usage
#else
            _jwtAuthKey = _configuration["AuthKey"]; // from secrets.json, inaccessible when hosted on IIS            
#endif

            _jwtIssuer = _authSettings.Value.Issuer;
            _jwtAudience = _authSettings.Value.Audience;
            _refreshTokenValiditityDays = _authSettings.Value.RefreshTokenValiditityDays;
            _tokenValidityMinutes = _authSettings.Value.TokenValidityMinutes;
        }

        /// <summary>
        /// Authenticate with this Web API using a username and password, token is persisted to the HttpOnly cookie
        /// </summary>
        /// <param name="loginModel">LoginModel instance</param>
        /// <returns>Bearer and Refresh tokens</returns>
        /// <response code="200">Returns User Id, hashed Refresh token and Token expiry date if authentication was successful</response>
        /// <response code="400">Nothing is returned if authentication fails or required values not provided</response>
        /// <response code="401">Nothing is returned if the UserForRegistration is not authorised</response>
        /// <response code="404">Nothing is returned if no UserForRegistration is found</response>
        /// <response code="500">Nothing is returned if the internal configuration is incorrect; see message</response>
        [HttpPost]
        [Route("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            if (string.IsNullOrEmpty(loginModel.Email) || string.IsNullOrEmpty(loginModel.Password))
            {
                return BadRequest();
            }

            User? user = await _userService.GetByEmailAsync(loginModel.Email);

            if (user is null)
            {
                return NotFound();
            }
            else
            {
                bool passwordVerified = BCrypt.Net.BCrypt.Verify(loginModel.Password, user.Password);
                if (!string.IsNullOrEmpty(user.Password) && !passwordVerified)
                {
                    return Unauthorized();
                }
            }

            List<Claim> userClaims = [];

            if (!string.IsNullOrEmpty(user.Id) && !string.IsNullOrEmpty(user.Email))
            {
                userClaims.Add(new Claim("Id", user.Id));
                userClaims.Add(new Claim(JwtRegisteredClaimNames.Sub, user.Email));
                userClaims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email));
                userClaims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));

                if (!string.IsNullOrEmpty(user.AssignedRoles))
                {
                    var roles = user.AssignedRoles.Split(",");

                    if (roles.Length > 0)
                    {
                        foreach (var role in roles)
                        {
                            userClaims.Add(new Claim(ClaimTypes.Role, role));
                        }
                    }
                }

                if (string.IsNullOrEmpty(_jwtAuthKey))
                {
                    return StatusCode(500, "Auth Key missing from configuration");
                }
                else if (string.IsNullOrEmpty(_jwtIssuer))
                {
                    return StatusCode(500, "Auth Issuer missing from configuration");
                }
                else if (string.IsNullOrEmpty(_jwtAudience))
                {
                    return StatusCode(500, "Auth Audience missing from configuration");
                }
                else
                {
                    // generate tokens
                    var token = AuthHelpers.GenerateAuthToken(userClaims, _jwtAuthKey, _jwtIssuer, _jwtAudience, _tokenValidityMinutes);
                    var refreshToken = AuthHelpers.GenerateRefreshToken();

                    // generate a hashedFingerprint to use for validation of the Refresh token
                    string hashedFingerprint = BCrypt.Net.BCrypt.HashPassword(refreshToken);

                    // assess token validity
                    if (_refreshTokenValiditityDays != -1 && token != null)
                    {
                        user.RefreshToken = refreshToken;
                        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(_refreshTokenValiditityDays);

                        // update User record in db
                        await _userService.UpdateAsync(user.Id, user);

                        string tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                        Response.Cookies.Append("X-Access-Token", tokenString, new CookieOptions() { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, IsEssential = true });
                        Response.Cookies.Append("X-Fingerprint", refreshToken, new CookieOptions() { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, IsEssential = true });

                        return Ok(new
                        {
                            UserId = user.Id,
                            RefreshToken = hashedFingerprint,
                            Expiration = token.ValidTo
                        });
                    }
                    else
                    {
                        return BadRequest("Failed to generate Refresh Token");
                    }
                }
            }
            else
            {
                return BadRequest("Required data is not present on User entity");
            }
        }

        /// <summary>
        /// Refresh an Access Token using a provided Refresh Token, token is persisted to the HttpOnly cookie
        /// </summary>
        /// <param name="tokenModel"></param>
        /// <returns>Refreshed Bearer and Refresh tokens</returns>
        /// <response code="200">Returns User Id, hashed Refresh token and Token expiry date if authentication was successful</response>
        /// <response code="400">Nothing is returned if authentication fails, required values are not provided or fingerprint is missing</response>
        /// <response code="401">Nothing is returned if fingerprint validation fails</response>
        /// <response code="404">Nothing is returned if no User is not found or is in an invalid state</response>
        /// <response code="500">Nothing is returned if the internal configuration is incorrect; see message</response>
        [HttpPost]
        [Route("Refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh([FromBody] TokenModel tokenModel)
        {
            if (tokenModel == null)
            {
                return BadRequest("Invalid request, token model is null");
            }

            string? tokenCookie = Request.Cookies["X-Access-Token"];
            string? refreshTokenCookie = Request.Cookies["X-Fingerprint"]; // unhashed refresh token

            if (refreshTokenCookie != null && !string.IsNullOrEmpty(refreshTokenCookie))
            {
                string? refreshTokenFingerprint = tokenModel.RefreshTokenFingerprint;

                bool fingerprintsMatch = BCrypt.Net.BCrypt.Verify(refreshTokenCookie, refreshTokenFingerprint);

                if (!fingerprintsMatch)
                {
                    return Unauthorized("Fingerprints don't match");
                }
                else if (string.IsNullOrEmpty(_jwtAuthKey))
                {
                    return StatusCode(500, "Auth Key missing from configuration");
                }
                else if (string.IsNullOrEmpty(_jwtIssuer))
                {
                    return StatusCode(500, "Auth Issuer missing from configuration");
                }
                else if (string.IsNullOrEmpty(_jwtAudience))
                {
                    return StatusCode(500, "Auth Audience missing from configuration");
                }
                else
                {
                    if (!string.IsNullOrEmpty(tokenModel.PrincipalId))
                    {
                        bool userAndPrincipalMatch = false;

                        // get User from database matching provided PrincipalId
                        User? user = await _userService.GetAsync(tokenModel.PrincipalId);

                        if (user == null || string.IsNullOrEmpty(user.Id))
                        {
                            return NotFound("User record state is invalid");
                        }

                        if (string.IsNullOrEmpty(user.RefreshToken) || !user.RefreshToken.Equals(refreshTokenCookie))
                        {
                            return Unauthorized("Refresh token cookie doens't match User record");
                        }

                        // get expired Principal from cookie if available
                        ClaimsPrincipal? expiredPrincipal = null;
                        if (tokenCookie != null && !string.IsNullOrEmpty(tokenCookie))
                        {
                            expiredPrincipal = AuthHelpers.GetPrincipalFromExpiredToken(tokenCookie, _jwtAuthKey);
                        }

                        if (expiredPrincipal != null)
                        {
                            var principalClaimId = expiredPrincipal.Claims.FirstOrDefault(c => c.Type == "Id");
                            if (principalClaimId != null)
                            {
                                userAndPrincipalMatch = principalClaimId.Value == user.Id;
                            }
                        }

                        if (!userAndPrincipalMatch)
                        {
                            return BadRequest("Mismatch in token data");
                        }

                        if (user.RefreshToken != refreshTokenCookie)
                        {
                            user.RefreshToken = null;
                            await _userService.UpdateAsync(user.Id, user);

                            return BadRequest("Invalid refresh token, User's Refresh Token has been revoked, they will need to log in again");
                        }

                        // force revocation of refresh tokens after expiry
                        if (user.RefreshTokenExpiryTime <= DateTime.Now)
                        {
                            user.RefreshToken = null;
                            await _userService.UpdateAsync(user.Id, user);

                            return BadRequest("Expired refresh token, User's Refresh Token has been revoked for rotation, they'll need to log in again");
                        }

                        var newToken = AuthHelpers.GenerateAuthToken(expiredPrincipal.Claims.ToList(), _jwtAuthKey, _jwtIssuer, _jwtAudience, _tokenValidityMinutes);

                        // generate a new hashedFingerprint to use for validation of the Refresh token, to replace the existing cookie
                        string newHashedFingerprint = BCrypt.Net.BCrypt.HashPassword(refreshTokenCookie);

                        string tokenString = new JwtSecurityTokenHandler().WriteToken(newToken);
                        Response.Cookies.Delete("X-Access-Token");
                        Response.Cookies.Append("X-Access-Token", tokenString, new CookieOptions() { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, IsEssential = true });
                        Response.Cookies.Delete("X-Fingerprint");
                        Response.Cookies.Append("X-Fingerprint", refreshTokenCookie, new CookieOptions() { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, IsEssential = true });

                        return Ok(new
                        {
                            UserId = user.Id,
                            RefreshToken = newHashedFingerprint,
                            Expiration = newToken.ValidTo
                        });
                    }
                    else
                    {
                        return BadRequest("Tokens or Auth Key invalid");
                    }
                }
            }
            else
            {
                return BadRequest("Fingerprint missing");
            }            
        }

        /// <summary>
        /// Revoke Refresh Tokens from a specific User in the database, this is an administrative action
        /// </summary>
        /// <param name="userIdOrEmailAddress"></param>
        /// <returns>Nothing</returns>
        /// <response code="204">Nothing is returned if this action is successful</response>
        /// <response code="400">Nothing is returned if no userIdOrEmailAddress is provided</response>
        /// <response code="404">Nothing is returned if no User record is found or the User record is in a bad state</response>
        [HttpPost]
        [Route("Revoke")]
        [Authorize(Policy = "userAdmin")]
        public async Task<IActionResult> Revoke(string userIdOrEmailAddress)
        {
            if (string.IsNullOrEmpty(userIdOrEmailAddress))
            {
                return BadRequest("User Id or Email Address null or empty");
            }

            User? user = await _userService.GetAsync(userIdOrEmailAddress);

            if (user == null)
            {
                user = await _userService.GetByEmailAsync(userIdOrEmailAddress);

                if (user == null)
                {
                    return NotFound("Invalid User Id or Email Address");
                }
            }

            if (string.IsNullOrEmpty(user.Id))
            {
                return NotFound("User record state is invalid");
            }

            user.RefreshToken = null;
            await _userService.UpdateAsync(user.Id, user);

            return NoContent();
        }

        /// <summary>
        /// Revoke Refresh Tokens from all Users in the database, this is an administrative action
        /// </summary>
        /// <returns>Nothing</returns>
        /// <response code="204">Nothing is returned if this action is successful</response>
        /// <response code="404">Nothing is returned if no User records are found</response>
        [HttpPost]
        [Route("RevokeAll")]
        [Authorize(Policy = "userAdmin")]
        public async Task<IActionResult> RevokeAll()
        {
            List<User>? users = await _userService.GetAsync();

            if (users == null || users.Count == 0)
            {
                return NotFound("No User records found");
            }

            users.ForEach(async u =>
            {
                if (!string.IsNullOrEmpty(u.Id))
                {
                    u.RefreshToken = null;
                    await _userService.UpdateAsync(u.Id, u);
                }
            });

            return NoContent();
        }
    }
}
