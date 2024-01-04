namespace Petroliq_API.Model
{
    /// <summary>
    /// User and UserSettings model, used to create new objects from a single object
    /// </summary>
    public class UserAndSettings
    {
#pragma warning disable CS1591
        public User? User { get; set; }
        public UserSettings? UserSettings { get; set; }
    }
#pragma warning restore CS1591
}
