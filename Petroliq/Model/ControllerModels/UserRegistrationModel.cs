namespace Petroliq_API.Model.ControllerModels
{
    /// <summary>
    /// UserRegistrationModel model, used to create new objects from a single object
    /// </summary>
    public class UserRegistrationModel
    {
        /// <summary>
        /// User for Registration object, doesn't include protected data
        /// </summary>
        public UserForRegistration? User { get; set; }

        /// <summary>
        /// User Settings for Registration, doesn't include protected data
        /// </summary>
        public UserSettingsForRegistration? UserSettings { get; set; }
    }
}
