using System.ComponentModel.DataAnnotations;

namespace Petroliq_API.Model.ControllerModels
{
    /// <summary>
    /// Login Model
    /// </summary>
    public class LoginModel
    {
        /// <summary>
        /// Login model Email field, required
        /// </summary>
        [Required(ErrorMessage = "Email Address is required")]
        public string? Email { get; set; }

        /// <summary>
        /// Login model Password field, required
        /// </summary>
        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
    }
}
