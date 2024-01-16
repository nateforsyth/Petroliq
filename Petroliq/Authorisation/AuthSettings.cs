namespace Petroliq_API.Authorisation
{
#pragma warning disable CS1591
    public class AuthSettings
    {
        public string Audience { get; set; } = null!;
        public string Key { get; set; } = null!;
        public string Issuer { get; set; } = null!;
        public int TokenValidityMinutes { get; set; } = -1;
        public int RefreshTokenValiditityDays { get; set; } = -1;
    }
#pragma warning restore CS1591
}
