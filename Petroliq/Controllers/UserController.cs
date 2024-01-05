using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Petroliq_API.Model;
using Petroliq_API.Services;

namespace Petroliq_API.Controllers
{
    /// <summary>
    /// User Controller
    /// </summary>
    [ApiController]
    [Route("api/[Controller]")]
    [Produces("application/json")]
    public class UserController(UserService userService, UserSettingsService userSettingsService) : ControllerBase
    {
        private readonly UserService _userService = userService;
        private readonly UserSettingsService _userSettingsService = userSettingsService;

        /// <summary>
        /// Get all User objects
        /// </summary>
        /// <returns>All User objects</returns>
        /// <response code="200">Returns all User Settings objects</response>
        /// <response code="204">Returns no content if no objects can be found</response>
        /// <response code="400">Nothing is returned if the objects are null</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize("read:users")]
        public async Task<List<User>> Get() => await _userService.GetAsync();

        /// <summary>
        /// Get a User object by Id string
        /// </summary>
        /// <param name="id"></param>
        /// <returns>The specified User object</returns>
        /// <response code="200">Returns the User object</response>
        /// <response code="404">Nothing is returned if the object is null</response>
        [HttpGet("{id:length(24)}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize("read:users")]
        public async Task<ActionResult<User>> Get(string id)
        {
            var user = await _userService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        /// <summary>
        /// Create a new User and associated Settings
        /// </summary>
        /// <param name="userAndSettings"></param>
        /// <returns>New User object</returns>
        /// <response code="201">Returns the newly created User object</response>
        /// <response code="400">Nothing is returned if the object is null</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize("write:users")]
        public async Task<IActionResult> Post(UserAndSettings userAndSettings)
        {
            if (userAndSettings.User != null && userAndSettings.UserSettings != null)
            {
                // create a new User object
                await _userService.CreateAsync(userAndSettings.User);

                // add the Settings object for this User
                userAndSettings.UserSettings.UserId = userAndSettings.User.Id;
                await _userSettingsService.CreateForUserAsync(userAndSettings.UserSettings);

                return CreatedAtAction(nameof(Get), new { id = userAndSettings.User.Id }, userAndSettings.User);
            }

            return BadRequest();            
        }

        /// <summary>
        /// Update an existing User
        /// </summary>
        /// <param name="id"></param>
        /// <param name="updatedUser"></param>
        /// <returns>Updated User object</returns>
        /// <response code="200">Returns the updated User object</response>
        /// <response code="404">Returns 404 if a User object couldn't be found for the User</response>
        [HttpPut("{id:length(24)}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize("write:users")]
        public async Task<IActionResult> Update(string id, User updatedUser)
        {
            var user = await _userService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            updatedUser.Id = user.Id;

            await _userService.UpdateAsync(id, updatedUser);

            return Ok(updatedUser);
        }

        /// <summary>
        /// Delete an existing User, including their Settings
        /// </summary>
        /// <param name="id"></param>
        /// <returns>No Content</returns>
        /// <response code="204">Returns nothing upon User and Settings object deletion</response>
        /// <response code="404">Returns 404 if a User Settings object couldn't be found for the User</response>
        [HttpDelete("{id:length(24)}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize("write:users")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userService.GetAsync(id);

            if (user is not null && user.Id is not null)
            {                
                var userSettings = await _userSettingsService.GetForUserAsync(user.Id, true);

                if (userSettings is null)
                {
                    return NotFound();
                }

                // attempt to delete this User's Settings object
                await _userSettingsService.RemoveForUserAsync(id);

                // attempt to delete this User
                await _userService.RemoveAsync(id);
            }
            else
            {
                return NotFound();
            }            

            return NoContent();
        }
    }
}
