namespace Petroliq_API.Model.ControllerModels
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
    }
}
