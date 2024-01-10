using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Petroliq_API.Authorisation
{
#pragma warning disable CS1591
    public class HasRoleHandler : AuthorizationHandler<HasRoleRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, HasRoleRequirement requirement)
        {
            // Check if UserForRegistration has a Role claim, if not exit
            if (!context.User.HasClaim(c => c.Type.Contains("role") && c.Issuer == requirement.Issuer))
            {
                return Task.CompletedTask;
            }

            // Split the requirement roles if delimited
            List<string>? requirementRoles = [.. requirement.Role];

            // Split the roles string into an array
            List<string>? roles = [];
            if (context.User != null)
            {
                Claim? claim = context.User.FindFirst(c => c.Type.Contains("role") && c.Issuer == requirement.Issuer);
                if (claim != null)
                {
                    roles = [.. claim.Value.Split(' ')];
                }

                foreach (var role in requirementRoles)
                {
                    if (context.User.IsInRole(role))
                    {
                        context.Succeed(requirement);

                        break;
                    }
                }
            }

            return Task.CompletedTask;
        }
    }
#pragma warning restore CS1591
}
