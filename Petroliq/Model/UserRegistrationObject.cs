namespace Petroliq_API.Model
{
    /// <summary>
    /// UserRegistrationObject model, used to create new objects from a single object
    /// </summary>
    public class UserRegistrationObject
    {
#pragma warning disable CS1591
        public UserForRegistration? User { get; set; }
        public UserSettingsForRegistration? UserSettings { get; set; }
    }
#pragma warning restore CS1591
}
