using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using RestSharp;
using ZstdSharp.Unsafe;
using System.Text.Json;
using Petroliq_API.Services;

namespace Petroliq_API.Controllers
{
    /// <summary>
    /// Auth0 Authentication Controller
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        /// <summary>
        /// Authenticate with Auth0
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="clientSecret"></param>
        /// <returns>Bearer token</returns>
        /// <response code="200">Returns a Bearer token if authentication was successful</response>
        /// <response code="400">Nothing is returned if authentication fails</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Authenticate(string clientId, string clientSecret)
        {
            var client = new RestClient("https://petroliqapi.au.auth0.com/oauth/token");
            var request = new RestRequest();
            request.Method = Method.Post;
            request.AddHeader("content-type", "application/json");
            request.AddParameter("application/json", "{\"client_id\":\"ulytcvheHuSk06Eos95RA57i77c6cPwl\",\"client_secret\":\"goyza61dDZRiy1PmyNfo9dWZtsHISvC3_DODqJfuAmHdu5GOLkPm1puEsrZVEeao\",\"audience\":\"https://petroliq.dreamsof.dev/api\",\"grant_type\":\"client_credentials\"}", ParameterType.RequestBody);
            RestResponse response = await client.ExecuteAsync(request);

            var token = JsonSerializer.Deserialize<AuthObject>(response.Content);

            if (token != null)
            {
                return Ok(token.access_token);
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
