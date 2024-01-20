namespace Petroliq_API.Model
{
    /// <summary>
    /// User Update Model
    /// </summary>
    public class UserUpdateModel
    {
        /// <summary>
        /// User Id
        /// </summary>
        public string? Id { get; set; }

        /// <summary>
        /// Updated User
        /// </summary>
        public User? UpdatedUser { get; set; }

        /// <summary>
        /// Updated User Settings
        /// </summary>
        public UserSettings? UpdatedUserSettings { get; set; }
    }
}
