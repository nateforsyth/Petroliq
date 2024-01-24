using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Petroliq_API.Authorisation;
using Petroliq_API.Model;
using Petroliq_API.Model.ControllerModels;
using Petroliq_API.Services;
using Shared.Model;
using static Shared.Enums;

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
        public async Task<List<User>> Get()
        {
            var users = await _userService.GetAsync();

            users.ForEach(u =>
            {
                u.Password = string.Empty;
                u.RefreshToken = string.Empty;
                u.RefreshTokenExpiryTime = null;
            });

            return users;
        }

        /// <summary>
        /// Get a User object by Id string
        /// </summary>
        /// <param name="fetchUserModel"></param>
        /// <returns>The specified User object</returns>
        /// <response code="200">Returns the User object</response>
        /// <response code="401">Nothing is returned if the user is unauthorised or trying to access a record they're not allowed to access</response>
        /// <response code="404">Nothing is returned if the object is null</response>
        /// <response code="500">Nothing is returned if there is no User in the context (should be impossible)</response>
        [HttpPost]
        [Route("FetchById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Policy = "appUser")]
        public async Task<ActionResult<User>> FetchById([FromBody] FetchUserModel fetchUserModel)
        {
            if (HttpContext.User == null)
            {
                return StatusCode(500, "No User in Context");
            }

            (bool retrieveAppUserOnly, string loggedInUserId) = AuthHelpers.ValidateAppUserRole(HttpContext);

            if (fetchUserModel != null && !string.IsNullOrEmpty(fetchUserModel.Id))
            {
                var user = await _userService.GetAsync(fetchUserModel.Id);

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
                    user.Password = string.Empty;
                    user.RefreshToken = string.Empty;
                    user.RefreshTokenExpiryTime = null;
                    return Ok(user);
                }
            }
            else
            {
                return BadRequest("User Id malformed or not supplied");
            }
        }

        /// <summary>
        /// Create a new User and associated Settings
        /// </summary>
        /// <param name="userRegistrationModel">UserRegistrationModel DTO excluding Id fields</param>
        /// <returns>New User object</returns>
        /// <response code="201">Returns the newly created User object</response>
        /// <response code="400">Nothing is returned if the object is null</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Route("RegisterNewUser")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterNewUser([FromBody] UserRegistrationModel userRegistrationModel)
        {
            if (userRegistrationModel.User != null && userRegistrationModel.UserSettings != null)
            {
                string passwordHash = string.Empty;
                if (string.IsNullOrEmpty(userRegistrationModel.User.Password)) // TODO flesh out password complexity requirements
                {
                    return base.BadRequest("Password was not provided or did not meet complexity requirements");
                }
                else
                {
                    passwordHash = BCrypt.Net.BCrypt.HashPassword((string)userRegistrationModel.User.Password);

                    // create a new UserForRegistration object
                    User user = new()
                    {
                        FirstName = userRegistrationModel.User.FirstName,
                        LastName = userRegistrationModel.User.LastName,
                        UserName = userRegistrationModel.User.UserName,
                        Email = userRegistrationModel.User.Email,
                        Password = passwordHash,
                        AssignedRoles = "appUser"
                    };

                    await _userService.CreateAsync(user);

                    // add the Settings object for this UserForRegistration
                    UserSettings userSettings = new ()
                    {
                        UserId = user.Id,
                        CountryName = userRegistrationModel.UserSettings.CountryName,
                        CurrencyUnit = (CurrencyUnit)Convert.ToInt64(userRegistrationModel.UserSettings.CurrencyUnit),
                        CapacityUnit = (CapacityUnit)Convert.ToInt64(userRegistrationModel.UserSettings.CapacityUnit),
                        DistanceUnit = (DistanceUnit)Convert.ToInt64(userRegistrationModel.UserSettings.DistanceUnit),
                        BaseDiscount = userRegistrationModel.UserSettings.BaseDiscount,
                        MinimumSpendForDiscount = userRegistrationModel.UserSettings.MinimumSpendForDiscount,
                        LastPricePerCapacityUnit = userRegistrationModel.UserSettings.LastPricePerCapacityUnit,
                        AccruedDiscount = userRegistrationModel.UserSettings.AccruedDiscount,
                        RoundTo = userRegistrationModel.UserSettings.RoundTo
                    };

                    await _userSettingsService.CreateForUserAsync(userSettings);

                    return base.CreatedAtAction(nameof(Get), new { id = user.Id }, $"{user.Email}");
                }
            }

            return BadRequest("User to malformed or not supplied");
        }

        /// <summary>
        /// Update an existing User
        /// </summary>
        /// <param name="userUpdateModel"></param>
        /// <returns>Updated User object</returns>
        /// <response code="200">Returns the updated User object</response>
        /// <response code="401">Nothing is returned if the user is unauthorised</response>
        /// <response code="404">Returns 404 if a User object couldn't be found for the User</response>
        /// <response code="500">Nothing is returned if there is no User in the context (should be impossible)</response>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Policy = "appUser")]
        public async Task<IActionResult> Update([FromBody] UserUpdateModel userUpdateModel)
        {
            if (HttpContext.User == null)
            {
                return StatusCode(500, "No User in Context");
            }

            (bool retrieveAppUserOnly, string loggedInUserId) = AuthHelpers.ValidateAppUserRole(HttpContext);

            if (userUpdateModel != null && !string.IsNullOrEmpty(userUpdateModel.Id) && userUpdateModel.UpdatedUser != null && userUpdateModel.UpdatedUserSettings != null)
            {
                User? user = await _userService.GetAsync(userUpdateModel.Id);
                UserSettings? userSettings = await _userSettingsService.GetForUserAsync(userUpdateModel.Id, true);

                if (user == null || userSettings == null)
                {
                    return NotFound();
                }
                else if (retrieveAppUserOnly && !loggedInUserId.Equals(user.Id))
                {
                    return Unauthorized("Your assigned role means that you cannot update other Users' data");
                }
                else
                {
                    userUpdateModel.UpdatedUser.Id = user.Id;
                    userUpdateModel.UpdatedUser.Password = user.Password;
                    userUpdateModel.UpdatedUser.AssignedRoles = user.AssignedRoles;
                    userUpdateModel.UpdatedUser.RefreshToken = user.RefreshToken;
                    userUpdateModel.UpdatedUser.RefreshTokenExpiryTime = user.RefreshTokenExpiryTime;

                    await _userService.UpdateAsync(userUpdateModel.Id, userUpdateModel.UpdatedUser);
                    List<string> updatedUserFields = Shared.Model.User.ValidateFieldUpdates(user, userUpdateModel.UpdatedUser);

                    userUpdateModel.UpdatedUserSettings.Id = userSettings.Id;
                    userUpdateModel.UpdatedUserSettings.UserId = userSettings.UserId;

                    await _userSettingsService.UpdateForUserAsync(userUpdateModel.Id, userUpdateModel.UpdatedUserSettings);
                    List<string> updatedUserSettingsFields = UserSettings.ValidateFieldUpdates(userSettings, userUpdateModel.UpdatedUserSettings);

                    userUpdateModel.UpdatedUser.Password = string.Empty;
                    userUpdateModel.UpdatedUser.RefreshToken = string.Empty;
                    userUpdateModel.UpdatedUser.RefreshTokenExpiryTime = null;

                    return Ok(new
                    {
                        User = userUpdateModel.UpdatedUser,
                        UpdatedUserFields = updatedUserFields.ToArray(),
                        UserSettings = userUpdateModel.UpdatedUserSettings,
                        UpdatedUserSettingsFields = updatedUserSettingsFields
                    });
                }
            }
            else
            {
                return BadRequest("User or UserSettings to update malformed or not provided");
            }            
        }

        /// <summary>
        /// Change the Password for the specified User by userId
        /// </summary>
        /// <param name="passwordChangeModel"></param>
        /// <response code="200">Returns a 200 response without payload if the password was successfully updated</response>
        /// <response code="400">Nothing is returned if required values not provided</response>
        /// <response code="401">Nothing is returned if the Password for the User doesn't match what they've provided</response>
        /// <response code="404">Nothing is returned if User is not found</response>
        /// <response code="500">Nothing is returned if there is no User in the context (should be impossible)</response>
        [HttpPost]
        [Route("ChangePassword")]
        [Authorize(Policy = "appUser")]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordChangeModel passwordChangeModel)
        {
            if (HttpContext.User == null)
            {
                return StatusCode(500, "No User in Context");
            }

            (bool retrieveAppUserOnly, string loggedInUserId) = AuthHelpers.ValidateAppUserRole(HttpContext);

            if (string.IsNullOrEmpty(passwordChangeModel.UserId) || string.IsNullOrEmpty(passwordChangeModel.OldPassword) || string.IsNullOrEmpty(passwordChangeModel.NewPassword))
            {
                return BadRequest();
            }

            var user = await _userService.GetAsync(passwordChangeModel.UserId);

            if (user is null)
            {
                return NotFound();
            }
            else
            {
                bool passwordVerified = BCrypt.Net.BCrypt.Verify(passwordChangeModel.OldPassword, user.Password);
                if (!string.IsNullOrEmpty(user.Password) && !passwordVerified)
                {
                    return Unauthorized();
                }
                else if (string.IsNullOrEmpty(user.Id))
                {
                    return BadRequest();
                }
                else if (retrieveAppUserOnly && !loggedInUserId.Equals(user.Id))
                {
                    return Unauthorized("Your assigned role means that you cannot update other Users' data");
                }
                else
                {
                    string passwordHash = BCrypt.Net.BCrypt.HashPassword(passwordChangeModel.NewPassword);
                    user.Password = passwordHash;

                    await _userService.UpdateAsync(user.Id, user);

                    user.Password = string.Empty;
                    user.RefreshToken = string.Empty;
                    user.RefreshTokenExpiryTime = null;
                    string[] updatedFields = ["Password"];

                    return Ok(new
                    {
                        User = user,
                        UpdatedUserFields = updatedFields
                    });
                }
            }
        }

        /// <summary>
        /// Delete an existing User, including their Settings
        /// </summary>
        /// <param name="deleteUserModel"></param>
        /// <returns>No Content</returns>
        /// <response code="204">Returns nothing upon User and Settings object deletion</response>
        /// <response code="401">Nothing is returned if the user is unauthorised</response>
        /// <response code="404">Returns 404 if a User Settings object couldn't be found for the User</response>
        /// <response code="500">Nothing is returned if there is no User in the context (should be impossible)</response>
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Policy = "appUser")]
        public async Task<IActionResult> Delete([FromBody] DeleteUserModel deleteUserModel)
        {
            if (HttpContext.User == null)
            {
                return StatusCode(500, "No User in Context");
            }

            (bool retrieveAppUserOnly, string loggedInUserId) = AuthHelpers.ValidateAppUserRole(HttpContext);

            if (deleteUserModel == null || deleteUserModel.Id == null)
            {
                return BadRequest("DeleteUserModel malformed or missing required data");
            }

            var user = await _userService.GetAsync(deleteUserModel.Id);

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
                await _userSettingsService.RemoveForUserAsync(deleteUserModel.Id);

                // attempt to delete this User
                await _userService.RemoveAsync(deleteUserModel.Id);
            }
            else
            {
                return NotFound();
            }            

            return NoContent();
        }

        //[HttpPost]
        //[Route("ResetPassword")]
        //[AllowAnonymous]
        //public async Task<IActionResult> ResetPassword(string email)
        //{
        //    if (string.IsNullOrEmpty(email))
        //    {
        //        return BadRequest();
        //    }

        //    var user = await _userService.GetByEmailAsync(email);

        //    if (user is null)
        //    {
        //        return NotFound();
        //    }
        //    else
        //    {
        //        // TODO implement password reset requests
        //    }
        //}
    }
}
