namespace Petroliq_API.Model.ControllerModels
{
    /// <summary>
    /// Fetch User Model; can retrieve a UserSettings object by Id or UserId, using the UseUserId bool
    /// </summary>
    public class FetchUserSettingsModel
    {
        /// <summary>
        /// UserSettings or User Id, default = User Id
        /// </summary>
        public string? Id { get; set; }

        /// <summary>
        /// Whether to use User Id (instead of UserSettings Id), default = true
        /// </summary>
        public bool UseUserId { get; set; } = true;
    }
}
