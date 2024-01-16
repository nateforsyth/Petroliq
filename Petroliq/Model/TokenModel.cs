namespace Petroliq_API.Model
{
    /// <summary>
    /// Token Model class used for Authentication, Authorisation and Token refresh purposes
    /// </summary>
    public class TokenModel
    {
        /// <summary>
        /// Access token
        /// </summary>
        public string? AccessToken { get; set; }

        /// <summary>
        /// Refresh token
        /// </summary>
        public string? RefreshToken { get; set; }
    }
}
