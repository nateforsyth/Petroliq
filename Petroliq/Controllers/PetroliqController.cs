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

        /// <summary>
        /// Petroliq controller constructor
        /// </summary>
        /// <param name="configuration"></param>
        public PetroliqController(IConfiguration configuration)
        {
            _configuration = configuration;
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

        //[HttpPost]
        //[Route("AddFill")]
        //public async Task<IActionResult> AddFill([FromBody] Fill fill)
        //{
        //    return Ok();
        //}
    }
}
