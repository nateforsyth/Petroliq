using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Petroliq_API.Authorisation;
using Petroliq_API.Model;
using Petroliq_API.Services;
using static Petroliq_API.Application.Enums;

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
        /// <response code="401">Nothing is returned if the user is unauthorised</response>
        /// <response code="403">Nothing is returned if the user is Forbidden</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Authorize(Policy = "userAdmin")]
        public async Task<List<User>> Get() => await _userService.GetAsync();

        /// <summary>
        /// Get a User object by Id string
        /// </summary>
        /// <param name="id"></param>
        /// <returns>The specified User object</returns>
        /// <response code="200">Returns the User object</response>
        /// <response code="401">Nothing is returned if the user is unauthorised or trying to access a record they're not allowed to access</response>
        /// <response code="404">Nothing is returned if the object is null</response>
        /// <response code="500">Nothing is returned if there is no User in the context (should be impossible)</response>
        [HttpGet("GetById/{id:length(24)}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Policy = "appUser")]
        public async Task<ActionResult<User>> GetById(string id)
        {
            if (HttpContext.User == null)
            {
                return StatusCode(500, "No User in Context");
            }

            (bool retrieveAppUserOnly, string loggedInUserId) = AuthHelpers.ValidateAppUserRole(HttpContext);

            var user = await _userService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }
            else if (retrieveAppUserOnly && !loggedInUserId.Equals(user.Id))
            {
                return Unauthorized("Your assigned role means that you cannot search for other Users' data");
            }
            else
            {
                return Ok(user);
            }
        }

        /// <summary>
        /// Create a new User and associated Settings
        /// </summary>
        /// <param name="userRegistrationObject">UserRegistrationObject DTO excluding Id fields</param>
        /// <returns>New User object</returns>
        /// <response code="201">Returns the newly created User object</response>
        /// <response code="400">Nothing is returned if the object is null</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Route("RegisterNewUser")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterNewUser(UserRegistrationObject userRegistrationObject)
        {
            if (userRegistrationObject.User != null && userRegistrationObject.UserSettings != null)
            {
                string passwordHash = string.Empty;
                if (string.IsNullOrEmpty(userRegistrationObject.User.Password)) // TODO flesh out password complexity requirements
                {
                    return base.BadRequest("Password was not provided or did not meet complexity requirements");
                }
                else
                {
                    passwordHash = BCrypt.Net.BCrypt.HashPassword((string)userRegistrationObject.User.Password);

                    // create a new UserForRegistration object
                    User user = new()
                    {
                        FirstName = userRegistrationObject.User.FirstName,
                        LastName = userRegistrationObject.User.LastName,
                        UserName = userRegistrationObject.User.UserName,
                        Email = userRegistrationObject.User.Email,
                        Password = passwordHash,
                        AssignedRoles = "appUser"
                    };

                    await _userService.CreateAsync(user);

                    // add the Settings object for this UserForRegistration
                    UserSettings userSettings = new ()
                    {
                        UserId = user.Id,
                        CountryName = userRegistrationObject.UserSettings.CountryName,
                        CurrencyUnit = (CurrencyUnit)Convert.ToInt64(userRegistrationObject.UserSettings.CurrencyUnit),
                        CapacityUnit = (CapacityUnit)Convert.ToInt64(userRegistrationObject.UserSettings.CapacityUnit),
                        DistanceUnit = (DistanceUnit)Convert.ToInt64(userRegistrationObject.UserSettings.DistanceUnit),
                        BaseDiscount = userRegistrationObject.UserSettings.BaseDiscount,
                        MinimumSpendForDiscount = userRegistrationObject.UserSettings.MinimumSpendForDiscount,
                        LastPricePerCapacityUnit = userRegistrationObject.UserSettings.LastPricePerCapacityUnit,
                        AccruedDiscount = userRegistrationObject.UserSettings.AccruedDiscount,
                        RoundTo = userRegistrationObject.UserSettings.RoundTo
                    };

                    await _userSettingsService.CreateForUserAsync(userSettings);

                    return base.CreatedAtAction(nameof(Get), new { id = user.Id }, $"{user.Email}");
                }
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
        /// <response code="401">Nothing is returned if the user is unauthorised</response>
        /// <response code="404">Returns 404 if a User object couldn't be found for the User</response>
        /// <response code="500">Nothing is returned if there is no User in the context (should be impossible)</response>
        [HttpPut("{id:length(24)}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Policy = "appUser")]
        public async Task<IActionResult> Update(string id, User updatedUser)
        {
            if (HttpContext.User == null)
            {
                return StatusCode(500, "No User in Context");
            }

            (bool retrieveAppUserOnly, string loggedInUserId) = AuthHelpers.ValidateAppUserRole(HttpContext);

            var user = await _userService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }
            else if (retrieveAppUserOnly && !loggedInUserId.Equals(user.Id))
            {
                return Unauthorized("Your assigned role means that you cannot update other Users' data");
            }
            else
            {
                updatedUser.Id = user.Id;

                await _userService.UpdateAsync(id, updatedUser);

                return Ok(updatedUser);
            }
        }

        /// <summary>
        /// Delete an existing User, including their Settings
        /// </summary>
        /// <param name="id"></param>
        /// <returns>No Content</returns>
        /// <response code="204">Returns nothing upon User and Settings object deletion</response>
        /// <response code="401">Nothing is returned if the user is unauthorised</response>
        /// <response code="404">Returns 404 if a User Settings object couldn't be found for the User</response>
        /// <response code="500">Nothing is returned if there is no User in the context (should be impossible)</response>
        [HttpDelete("{id:length(24)}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Policy = "appUser")]
        public async Task<IActionResult> Delete(string id)
        {
            if (HttpContext.User == null)
            {
                return StatusCode(500, "No User in Context");
            }

            (bool retrieveAppUserOnly, string loggedInUserId) = AuthHelpers.ValidateAppUserRole(HttpContext);

            var user = await _userService.GetAsync(id);

            if (user is not null && user.Id is not null)
            {
                if (retrieveAppUserOnly && !loggedInUserId.Equals(user.Id))
                {
                    return Unauthorized("Your assigned role means that you cannot delete other Users' data");
                }

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
