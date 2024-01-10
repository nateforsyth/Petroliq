using Microsoft.AspNetCore.Authorization;

namespace Petroliq_API.Authorisation
{
#pragma warning disable CS1591
    public class HasRoleRequirement(string issuer, string[] roles) : IAuthorizationRequirement
    {
        public string Issuer { get; } = issuer ?? throw new ArgumentNullException(nameof(issuer));
        public string[] Role { get; } = roles ?? throw new ArgumentNullException(nameof(roles));
    }
#pragma warning restore CS1591
}
