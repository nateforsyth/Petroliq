using Microsoft.AspNetCore.Mvc;
using Petroliq_API.Services;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Petroliq_API.Model;
using Microsoft.Extensions.Options;
using Petroliq_API.Authorisation;

namespace Petroliq_API.Controllers
{
    /// <summary>
    /// Authentication Controller
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IConfiguration configuration, UserService userService, IOptions<AuthSettings> authSettings) : ControllerBase
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly UserService _userService = userService;

        /// <summary>
        /// Authenticate with this Web API using a username and password
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <returns>Bearer token</returns>
        /// <response code="200">Returns a Bearer token if authentication was successful</response>
        /// <response code="400">Nothing is returned if authentication fails or required values not provided</response>
        /// <response code="401">Nothing is returned if the UserForRegistration is not authorised</response>
        /// <response code="404">Nothing is returned if no UserForRegistration is found</response>
        /// <response code="500">Nothing is returned if the internal configuration is incorrect; see message</response>
        [HttpPost]
        [Route("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                return BadRequest();
            }

            var user = await _userService.GetByEmailAsync(email);

            if (user is null)
            {
                return NotFound();
            }
            else
            {
                bool passwordVerified = BCrypt.Net.BCrypt.Verify(password, user.Password);
                if (!string.IsNullOrEmpty(user.Password) && !passwordVerified)
                {
                    return Unauthorized();
                }
            }

            List<Claim> userClaims = [];

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

            string? jwtAuthKey = string.Empty;
#if !DEBUG
             jwtAuthKey = _configuration["Auth:Key"]; // authSettings.Value.Key; // from appsettings.json, for IIS usage
#else
            jwtAuthKey = _configuration["AuthKey"]; // from secrets.json, inaccessible when hosted on IIS            
#endif

            var jwtIssuer = authSettings.Value.Issuer;

            var jwtAudience = authSettings.Value.Audience;

            if (string.IsNullOrEmpty(jwtAuthKey))
            {
                return StatusCode(500, "Auth Key missing from configuration");
            }
            else if (string.IsNullOrEmpty(jwtIssuer))
            {
                return StatusCode(500, "Auth Issuer missing from configuration");
            }
            else if (string.IsNullOrEmpty(jwtAudience))
            {
                return StatusCode(500, "Auth Audience missing from configuration");
            }
            else
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtAuthKey));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var securityToken = new JwtSecurityToken(
                        issuer: jwtIssuer,
                        audience: jwtAudience,
                        expires: DateTime.Now.AddMinutes(5),
                        signingCredentials: credentials,
                        claims: userClaims
                    );

                var token = new JwtSecurityTokenHandler().WriteToken(securityToken);

                return Ok(token);
            }         
        }
    }
}
