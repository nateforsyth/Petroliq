using Shared.Model;

namespace Petroliq_API.Model.ControllerModels
{
    /// <summary>
    /// Update UserSettings Model; can update a UserSettings object by Id or UserId, using the UseUserId bool
    /// </summary>
    public class UpdateUserSettingsModel
    {
        /// <summary>
        /// UserSettings or User Id, default = User Id
        /// </summary>
        public string? Id { get; set; }

        /// <summary>
        /// Whether to use User Id (instead of UserSettings Id), default = true
        /// </summary>
        public bool UseUserId { get; set; } = true;

        /// <summary>
        /// UserSettings object containing updates
        /// </summary>
        public UserSettings? UpdatedUserSettings { get; set; }
    }
}
