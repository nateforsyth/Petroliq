using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Petroliq_API.Model;

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
        private readonly decimal _kmToMiFactor; // Petroliq:KM_MI_FACTOR
        private readonly decimal _miToKmFactor; // Petroliq:MI_KM_FACTOR
        private readonly decimal _ltrToGalFactor; // Petroliq:LTR_GAL_FACTOR
        private readonly int _defaultRoundTo; // Petroliq:DEFAULT_ROUND_TO
        private readonly bool _petroliqSettingsParsed = false;

#pragma warning disable CS1591
        public decimal GetKmToMiFactor()
        {
            return _petroliqSettingsParsed ? _kmToMiFactor : -1;
        }
#pragma warning restore CS1591

#pragma warning disable CS1591
        public decimal GetMiToKmFactor()
        {
            return _petroliqSettingsParsed ? _miToKmFactor : -1;
        }
#pragma warning restore CS1591

#pragma warning disable CS1591
        public decimal GetLtrToGalFactor()
        {
            return _petroliqSettingsParsed ? _ltrToGalFactor : -1;
        }
#pragma warning restore CS1591

#pragma warning disable CS1591
        public int GetDefaultRoundTo()
        {
            return _petroliqSettingsParsed ? _defaultRoundTo : -1;
        }
#pragma warning restore CS1591

        /// <summary>
        /// Petroliq controller constructor
        /// </summary>
        /// <param name="configuration"></param>
        public PetroliqController(IConfiguration configuration)
        {
            _configuration = configuration;

            _petroliqSettingsParsed =
                decimal.TryParse(_configuration["Petroliq:KM_MI_FACTOR"], out _kmToMiFactor) &&
                decimal.TryParse(_configuration["Petroliq:MI_KM_FACTOR"], out _miToKmFactor) &&
                decimal.TryParse(_configuration["Petroliq:LTR_GAL_FACTOR"], out _ltrToGalFactor) &&            
                int.TryParse(_configuration["Petroliq:DEFAULT_ROUND_TO"], out _defaultRoundTo);
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
    }
}
