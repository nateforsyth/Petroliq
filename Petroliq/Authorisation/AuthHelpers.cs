using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Petroliq_API.Authorisation
{
#pragma warning disable CS1591
    public class AuthHelpers
    {
        public static (bool validateAppUserOnly, string loggedInUserId) ValidateAppUserRole(HttpContext context)
        {
            bool appUserOnly = false;
            string loggedInUserId = string.Empty;
            var loggedInUserClaim = context.User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (loggedInUserClaim != null)
            {
                loggedInUserId = loggedInUserClaim.Value;
            }

            if (context.User.IsInRole("appUser") && !string.IsNullOrEmpty(loggedInUserId))
            {
                appUserOnly = true;
            }

            return (appUserOnly, loggedInUserId);
        }

        public static JwtSecurityToken GenerateAuthToken(List<Claim> userClaims, string jwtAuthKey, string jwtIssuer, string jwtAudience, int expiryOffsetMinutes)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtAuthKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var securityToken = new JwtSecurityToken(
                    issuer: jwtIssuer,
                    audience: jwtAudience,
                    expires: DateTime.Now.AddMinutes(expiryOffsetMinutes),
                    signingCredentials: credentials,
                    claims: userClaims
                );

            return securityToken;
        }

        public static ClaimsPrincipal? GetPrincipalFromExpiredToken(string token, string jwtAuthKey)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtAuthKey)),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var claimsPrincipal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }

            return claimsPrincipal;
        }

        public static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
#pragma warning restore CS1591
}
