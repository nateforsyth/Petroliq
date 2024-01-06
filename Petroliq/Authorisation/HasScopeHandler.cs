using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Petroliq_API.Authorisation
{
#pragma warning disable CS1591
    public class HasScopeHandler : AuthorizationHandler<HasScopeRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, HasScopeRequirement requirement)
        {
            // If user does not have the scope claim, get out of here
            if (!context.User.HasClaim(c => c.Type == "scope" && c.Issuer == requirement.Issuer))
                return Task.CompletedTask;

            // Split the scopes string into an array
            string[]? scopes = [];
            if (context.User != null)
            {
                Claim? claim = context.User.FindFirst(c => c.Type == "scope" && c.Issuer == requirement.Issuer);
                if (claim != null)
                {
                    scopes = claim.Value.Split(' ');
                }
            }

            // Succeed if the scope array contains the required scope
            if (scopes.Any(s => s == requirement.Scope))
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }

    //protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, RbacRequirement requirement)
    //{
    //    if (!context.User.HasClaim(c => c.Type == "permissions"))
    //    {
    //        return Task.CompletedTask;
    //    }

    //    var permission = context.User.FindFirst(c => c.Type == "permissions" && c.Value == requirement.Permission);

    //    if (permission == null)
    //    {
    //        return Task.CompletedTask;
    //    }

    //    context.Succeed(requirement);

    //    return Task.CompletedTask;
    //}
#pragma warning restore CS1591
}
