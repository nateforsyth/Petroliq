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
        }

        /// <summary>
        /// Authenticate with this Web API using a username and password
        /// </summary>
        /// <param name="loginModel">LoginModel instance</param>
        /// <returns>Bearer and Refresh tokens</returns>
        /// <response code="200">Returns Bearer and Refresh tokens as well as an expiry date if authentication was successful</response>
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
                    var token = AuthHelpers.GenerateAuthToken(userClaims, _jwtAuthKey, _jwtIssuer, _jwtAudience);
                    var refreshToken = AuthHelpers.GenerateRefreshToken();

                    // assess token validity
                    if (int.TryParse(_configuration["Auth:RefreshTokenValiditityDays"], out int refreshTokenValidityDays))
                    {
                        user.RefreshToken = refreshToken;
                        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityDays);

                        // update User record in db
                        await _userService.UpdateAsync(user.Id, user);

                        return Ok(new
                        {
                            Token = new JwtSecurityTokenHandler().WriteToken(token),
                            RefreshToken = refreshToken,
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
        /// Refresh an Access Token using a provided Refresh Token
        /// </summary>
        /// <param name="tokenModel"></param>
        /// <returns>Refreshed Bearer and Refresh tokens</returns>
        /// <response code="200">Returns refreshed Bearer and Refresh tokens as well as an expiry date if authentication was successful</response>
        /// <response code="400">Nothing is returned if authentication fails or required values not provided</response>
        /// <response code="404">Nothing is returned if no UserForRegistration is found</response>
        /// <response code="500">Nothing is returned if the internal configuration is incorrect; see message</response>
        [HttpPost]
        [Route("Refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh(TokenModel tokenModel)
        {
            if (tokenModel == null)
            {
                return BadRequest("Invalid request, token model is null");
            }

            string? token = tokenModel.AccessToken;
            string? refreshToken = tokenModel.RefreshToken;

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
                if (!string.IsNullOrEmpty(token) && !string.IsNullOrEmpty(refreshToken) && !string.IsNullOrEmpty(_jwtAuthKey))
                {
                    var principal = AuthHelpers.GetPrincipalFromExpiredToken(token, _jwtAuthKey);

                    if (principal != null)
                    {
                        var idClaim = principal.Claims.FirstOrDefault(c => c.Type == "Id");
                        if (idClaim != null)
                        {
                            string userId = idClaim.Value;
                            User? user = await _userService.GetAsync(userId);

                            if (user == null || string.IsNullOrEmpty(user.Id))
                            {
                                return NotFound("User record state is invalid");
                            }

                            if (user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
                            {
                                return BadRequest("Invalid or expired refresh token");
                            }

                            var newToken = AuthHelpers.GenerateAuthToken(principal.Claims.ToList(), _jwtAuthKey, _jwtIssuer, _jwtAudience);
                            var newRefreshToken = AuthHelpers.GenerateRefreshToken();

                            user.RefreshToken = newRefreshToken;
                            await _userService.UpdateAsync(user.Id, user);

                            return Ok(new
                            {
                                Token = new JwtSecurityTokenHandler().WriteToken(newToken),
                                RefreshToken = refreshToken,
                                Expiration = newToken.ValidTo
                            });
                        }
                        else
                        {
                            return BadRequest("Token doesn't contain required Id claim");
                        }
                    }
                    else
                    {
                        return BadRequest("Unable to retrieve principal from token");
                    }
                }
                else
                {
                    return BadRequest("Tokens or Auth Key invalid");
                }
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
