using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Petroliq_API.Authorisation;
using Petroliq_API.Model;
using Petroliq_API.Model.ControllerModels;
using Petroliq_API.Services;

namespace Petroliq_API.Controllers
{
    /// <summary>
    /// User Settings Controller
    /// </summary>
    [ApiController]
    [Route("api/[Controller]")]
    public class UserSettingsController(UserSettingsService userSettingsService) : Controller
    {
        private readonly UserSettingsService _userSettingsService = userSettingsService;

        /// <summary>
        /// Get all Users Settings objects
        /// </summary>
        /// <returns>All User Settings objects</returns>
        /// <response code="200">Returns all User Settings objects</response>
        /// <response code="204">Returns no content if no objects can be found</response>
        /// <response code="400">Nothing is returned if the objects are null</response>
        /// <response code="401">Nothing is returned if the user is unauthorised</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Authorize(Policy = "userAdmin")]
        public async Task<List<UserSettings>> Get() => await _userSettingsService.GetAsync();

        /// <summary>
        /// Get Settings object for the specified User
        /// </summary>
        /// <param name="fetchUserSettingsModel"></param>
        /// <returns>The Settings object for the specified User</returns>
        /// <response code="200">Returns the User Settings object</response>
        /// <response code="401">Nothing is returned if the user is unauthorised</response>
        /// <response code="404">Nothing is returned if the object is null</response>
        /// <response code="500">Nothing is returned if there is no User in the context (should be impossible)</response>
        [HttpPost]
        [Route("FetchById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Policy = "appUser")]
        public async Task<ActionResult<UserSettings>> FetchById([FromBody] FetchUserSettingsModel fetchUserSettingsModel)
        {
            if (HttpContext.User == null)
            {
                return StatusCode(500, "No User in Context");
            }

            if (fetchUserSettingsModel == null || fetchUserSettingsModel.Id == null)
            {
                return BadRequest("FetchUserSettingsModel malformed or missing required data");
            }

            (bool retrieveAppUserOnly, string loggedInUserId) = AuthHelpers.ValidateAppUserRole(HttpContext);

            var userSettings = await _userSettingsService.GetForUserAsync(fetchUserSettingsModel.Id, fetchUserSettingsModel.UseUserId);

            if (userSettings is null)
            {
                return NotFound();
            }
            else if (retrieveAppUserOnly && !loggedInUserId.Equals(userSettings.UserId))
            {
                return Unauthorized("Your assigned role means that you cannot search for other Users' data");
            }
            else
            {
                return Ok(userSettings);
            }
        }

        /// <summary>
        /// Update an existing User Settings object for the specific User
        /// </summary>
        /// <param name="updatedUserSettingsModel"></param>
        /// <returns>Updated User Settings object</returns>
        /// <response code="200">Returns the updated User Settings object</response>
        /// <response code="401">Nothing is returned if the user is unauthorised</response>
        /// <response code="404">Returns 404 if a User Settings object couldn't be found for the User</response>
        /// <response code="500">Nothing is returned if there is no User in the context (should be impossible)</response>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Policy = "appUser")]
        public async Task<IActionResult> Update([FromBody] UpdateUserSettingsModel updatedUserSettingsModel)
        {
            if (HttpContext.User == null)
            {
                return StatusCode(500, "No User in Context");
            }

            if (updatedUserSettingsModel == null || updatedUserSettingsModel.Id == null || updatedUserSettingsModel.UpdatedUserSettings == null)
            {
                return BadRequest("UpdateUserSettingsModel malformed or missing required data");
            }

            (bool retrieveAppUserOnly, string loggedInUserId) = AuthHelpers.ValidateAppUserRole(HttpContext);

            var userSettings = await _userSettingsService.GetForUserAsync(updatedUserSettingsModel.Id, updatedUserSettingsModel.UseUserId);

            if (userSettings is null)
            {
                return NotFound();
            }
            else if (retrieveAppUserOnly && !loggedInUserId.Equals(userSettings.UserId))
            {
                return Unauthorized("Your assigned role means that you cannot update other Users' data");
            }
            else
            {
                updatedUserSettingsModel.UpdatedUserSettings.Id = userSettings.Id;
                updatedUserSettingsModel.UpdatedUserSettings.UserId = userSettings.UserId;

                await _userSettingsService.UpdateForUserAsync(updatedUserSettingsModel.Id, updatedUserSettingsModel.UpdatedUserSettings);

                return Ok(updatedUserSettingsModel.UpdatedUserSettings);
            }
        }
    }
}
