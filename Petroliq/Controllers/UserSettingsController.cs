﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Petroliq_API.Model;
using Petroliq_API.Services;
using System.Net;

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
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize("read:userSettings")]
        public async Task<List<UserSettings>> Get() => await _userSettingsService.GetAsync();

        /// <summary>
        /// Get Settings object for the specified User
        /// </summary>
        /// <param name="userIdStr"></param>
        /// <returns>The Settings object for the specified User</returns>
        /// <response code="200">Returns the User Settings object</response>
        /// <response code="404">Nothing is returned if the object is null</response>
        [HttpGet("{userIdStr:length(24)}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize("read:userSettings")]
        public async Task<ActionResult<UserSettings>> GetSettingsForUser(string userIdStr)
        {
            var userSettings = await _userSettingsService.GetForUserAsync(userIdStr);

            if (userSettings is null)
            {
                return NotFound();
            }

            return Ok(userSettings);
        }

        /// <summary>
        /// Update an existing User Settings object for the specific User
        /// </summary>
        /// <param name="userIdStr"></param>
        /// <param name="updatedUserSettings"></param>
        /// <returns>Updated User Settings object</returns>
        /// <response code="200">Returns the updated User Settings object</response>
        /// <response code="404">Returns 404 if a User Settings object couldn't be found for the User</response>
        [HttpPut("{userIdStr:length(24)}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize("write:userSettings")]
        public async Task<IActionResult> Update(string userIdStr, UserSettings updatedUserSettings)
        {
            var userSettings = await _userSettingsService.GetForUserAsync(userIdStr);

            if (userSettings is null)
            {
                return NotFound();
            }

            updatedUserSettings.Id = userSettings.Id;

            await _userSettingsService.UpdateForUserAsync(userIdStr, updatedUserSettings);

            return Ok(updatedUserSettings);
        }
    }
}
