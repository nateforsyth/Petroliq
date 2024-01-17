namespace Petroliq_API.Model
{
    /// <summary>
    /// Password Change Model
    /// </summary>
    public class PasswordChangeModel
    {
        /// <summary>
        /// User Id
        /// </summary>
        public string? UserId { get; set; }

        /// <summary>
        /// Old Password
        /// </summary>
        public string? OldPassword { get; set; }

        /// <summary>
        /// New Password
        /// </summary>
        public string? NewPassword { get; set; }
    }
}
