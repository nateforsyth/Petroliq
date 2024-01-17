namespace Petroliq_API.Model
{
    /// <summary>
    /// Token Model class used for Authentication, Authorisation and Token refresh purposes
    /// </summary>
    public class TokenModel
    {
        /// <summary>
        /// Principal Id
        /// </summary>
        public string? PrincipalId { get; set; }

        /// <summary>
        /// Refresh token, hashed and to be compared with cookie
        /// </summary>
        public string? RefreshTokenFingerprint { get; set; }
    }
}
