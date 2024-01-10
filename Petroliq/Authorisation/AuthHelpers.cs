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
    }
#pragma warning restore CS1591
}
