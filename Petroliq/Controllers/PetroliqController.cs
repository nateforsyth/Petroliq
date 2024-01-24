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
    /// Petroliq controller
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class PetroliqController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserSettingsService _userSettingsService;

        /// <summary>
        /// Petroliq controller constructor
        /// </summary>
        /// <param name="configuration"></param>
        /// <param name="userSettingsService"></param>
        public PetroliqController(IConfiguration configuration, UserSettingsService userSettingsService)
        {
            _configuration = configuration;
            _userSettingsService = userSettingsService;
        }

        /// <summary>
        /// Get Petroliq Overviews
        /// </summary>
        /// <returns>Petroliq Overview objects</returns>
        /// <response code="200">Returns Petroliq Overview objects</response>
        /// <response code="400">Nothing is returned if the objects are null</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
#if !DEBUG
        [Authorize("appUser")]
#endif
        public PetroliqOverview Get()
        {
            return new PetroliqOverview("Overview: TODO");
        }

        /// <summary>
        /// Calculates how much fuel capacity is required to reach the specified toSpend value using the specifiedDiscount, currently waits 5 seconds to simulate long-running task
        /// </summary>
        /// <param name="toSpend"></param>
        /// <param name="specifiedDiscount"></param>
        /// <returns>Calculated capacity</returns>
        /// <response code="200">Returns the calculated Capacity</response>
        /// <response code="400">Nothing is returned if the calculation has failed</response>
        [HttpGet("{toSpend}/{specifiedDiscount}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
#if !DEBUG
        [Authorize("appUser")]
#endif
        public async Task<IActionResult> Get(float toSpend, float specifiedDiscount)
        {
            await Task.Delay(TimeSpan.FromSeconds(5)); // TODO remove wait and implement algorithm

            return Ok($"{toSpend}|{specifiedDiscount}");
        }

        /// <summary>
        /// Add a Fill object to the database for the logged in User
        /// </summary>
        /// <param name="fillModel"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("AddFill")]
        [Authorize("appUser")]
        public async Task<IActionResult> AddFill([FromBody] AddFillModel fillModel)
        {
            if (HttpContext.User == null)
            {
                return StatusCode(500, "No User in Context");
            }

            (bool retrieveAppUserOnly, string loggedInUserId) = AuthHelpers.ValidateAppUserRole(HttpContext);

            if (ModelState.IsValid)
            {
                var userSettings = await _userSettingsService.GetForUserAsync(loggedInUserId, true);
                if (userSettings == null)
                {
                    return BadRequest();
                }

                if (decimal.TryParse(_configuration["Petroliq:KM_MI_FACTOR"], out decimal kmMiFactor) &&
                    decimal.TryParse(_configuration["Petroliq:MI_KM_FACTOR"], out decimal miKmFactor) &&
                    decimal.TryParse(_configuration["Petroliq:LTR_GAL_FACTOR"], out decimal ltrGalFactor))
                {
                    Fill fill = new Fill(
                        userSettings.CurrentBatchId,
                        userSettings.NextFillId,
                        fillModel.FillDate,
                        userSettings.CapacityUnit,
                        userSettings.DistanceUnit,
                        fillModel.StartOdo,
                        fillModel.EndOdo,
                        fillModel.Volume,
                        fillModel.Discount,
                        kmMiFactor,
                        miKmFactor,
                        ltrGalFactor,
                        fillModel.DiscountCashed,
                        fillModel.UnitSpotPrice,
                        userSettings.RoundTo
                    );

                    // calculate consumption metrics
                    if (userSettings.DistanceUnit == DistanceUnit.Kilometers)
                    {
                        fill.KmPerLtr();
                    }
                    else
                    {
                        fill.MiPerGal();
                    }

                    // add fill1Discount to settings.AccruedDiscount if fill1Discount hasn't been cashed
                    if (!fillModel.DiscountCashed)
                    {
                        userSettings.AccruedDiscount += fill.Discount;
                        userSettings.NextFillId += 1;
                    }
                    else
                    {
                        userSettings.AccruedDiscount = 0;
                        userSettings.NextFillId = 0;
                        userSettings.CurrentBatchId += 1;
                    }

                    if (!string.Equals($"{userSettings.LastPricePerCapacityUnit}", $"{fill.UnitSpotPrice}")) // TODO fix this because rounding is a problem
                    {
                        userSettings.LastPricePerCapacityUnit = fill.UnitSpotPrice;
                    }

                    return Ok(new
                    {
                        Fill = fill,
                        UserSettings = userSettings
                    });
                }
                else
                {
                    return BadRequest();
                }                
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
    }
}
