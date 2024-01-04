using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using RestSharp;
using ZstdSharp.Unsafe;
using System.Text.Json;
using Petroliq_API.Services;
using static System.Net.WebRequestMethods;

namespace Petroliq_API.Controllers
{
    /// <summary>
    /// Auth0 Authentication Controller
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IConfiguration configuration) : ControllerBase
    {
        private readonly IConfiguration _configuration = configuration;

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
            var client = new RestClient($"{_configuration["Auth0:ClientUrl"]}");
            var request = new RestRequest();
            request.Method = Method.Post;
            request.AddHeader("content-type", "application/json");

            var authReqObject = new AuthRequestObject();
            authReqObject.client_id = clientId;
            authReqObject.client_secret = clientSecret;
            authReqObject.audience = $"{_configuration["Auth0:Audience"]}";
            authReqObject.grant_type = "client_credentials";
            var authReqObjStr = JsonSerializer.Serialize(authReqObject);

            request.AddParameter("application/json", authReqObjStr, ParameterType.RequestBody);
            RestResponse response = await client.ExecuteAsync(request);

            if (response != null && response.Content != null)
            {
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
            else
            {
                return BadRequest();
            }
        }
    }
}
