using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Mineswe.io.WebApi.Models;
using Mineswe.io.WebApi.Services;
using Mineswe.io.WebApi.Services.Authentication;
using Newtonsoft.Json;

namespace Mineswe.io.WebApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<AuthController> _logger;
        private readonly IAuthSerivce _authService;

        public AuthController(IUserService userService, IAuthSerivce authService, ILogger<AuthController> logger)
        {
            _userService = userService;
            _logger = logger;
            _authService = authService;
        }

        // POST
        /// <summary>
        /// Auth and get JWT
        /// </summary>
        /// <param name="model">Auth Request</param>
        /// <returns>Token Data</returns>
        [HttpPost("[action]")]
        public async Task<IActionResult> Auth([FromForm] AuthRequest model)
        {
            var response = await _authService.AuthAsync(model);

            if (response == null)
                return BadRequest(new {message = "Invalid Username or Password"});

            return Ok(response);
        }
    }
}