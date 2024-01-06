using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Petroliq_API.Controllers
{
    /// <summary>
    /// Error Controller
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ErrorController : ControllerBase
    {
        /// <summary>
        /// Error handler for the ASP.NET pipeline
        /// </summary>
        /// <returns></returns>
        [ApiExplorerSettings(IgnoreApi = true)]
        [Route("/error")]
        public ActionResult HandleError() => Problem();

        /// <summary>
        /// Error handler for the ASP.NET pipeline (Development)
        /// </summary>
        /// <returns></returns>
        [ApiExplorerSettings(IgnoreApi = true)]
        [Route("/error-development")]
        public ActionResult HandleErrorDevelopment([FromServices] IHostEnvironment hostEnvironment)
        {
            if (!hostEnvironment.IsDevelopment())
            {
                return NotFound();
            }

            var exceptionHandlerFeature =
                HttpContext.Features.Get<IExceptionHandlerFeature>()!;

            return Problem(
                detail: exceptionHandlerFeature.Error.StackTrace,
                title: exceptionHandlerFeature.Error.Message);
        }
    }
}
