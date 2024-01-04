using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Petroliq;
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
        /// <summary>
        /// Get Petroliq Overviews
        /// </summary>
        /// <returns>Petroliq Overview objects</returns>
        /// <response code="200">Returns Petroliq Overview objects</response>
        /// <response code="400">Nothing is returned if the objects are null</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public PetroliqOverview Get()
        {
            return new PetroliqOverview("Nate");
        }

        /// <summary>
        /// Calculates how much fuel capacity is required to reach the specified toSpend value using the specifiedDiscount
        /// </summary>
        /// <param name="toSpend"></param>
        /// <param name="specifiedDiscount"></param>
        /// <returns>Calculated capacity</returns>
        /// <response code="200">Returns the calculated Capacity</response>
        /// <response code="400">Nothing is returned if the calculation has failed</response>
        [HttpGet("{toSpend}/{specifiedDiscount}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Get(float toSpend, float specifiedDiscount)
        {
            await Task.Delay(TimeSpan.FromSeconds(10));

            return Ok($"{toSpend}|{specifiedDiscount}");
        }
    }
}
