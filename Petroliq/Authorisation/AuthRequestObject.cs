namespace Petroliq_API.Authorisation
{
#pragma warning disable IDE1006 // Naming Styles
#pragma warning disable CS1591
    public class AuthRequestObject
    {
        public string? client_id { get; set; }
        public string? client_secret { get; set; }
        public string? audience { get; set; }
        public string? grant_type { get; set; }
    }
}
#pragma warning restore CS1591
#pragma warning restore IDE1006 // Naming Styles
