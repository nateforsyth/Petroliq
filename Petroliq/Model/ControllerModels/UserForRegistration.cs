namespace Petroliq_API.Model.ControllerModels
{
    /// <summary>
    /// Intermediary User object specifically for Registration, doesn't include Id fields
    /// </summary>
    public class UserForRegistration
    {
#pragma warning disable CS1591
        public string? FirstName { get; set; }
        public string? LastName { get; set; } = string.Empty;
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
#pragma warning restore CS1591
    }
}
