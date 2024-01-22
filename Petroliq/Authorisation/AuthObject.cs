namespace Petroliq_API.Authorisation
{
#pragma warning disable IDE1006 // Naming Styles
#pragma warning disable CS1591
    public class AuthObject
    {
        public string? access_token { get; set; }
        public string? scope { get; set; }
        public int expires_in { get; set; }
        public string? token_type { get; set; }
    }
}
#pragma warning restore CS1591
#pragma warning restore IDE1006 // Naming Styles
