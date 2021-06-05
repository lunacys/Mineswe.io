using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Mineswe.io.WebApi.Models;
using Mineswe.io.WebApi.Services;
using Newtonsoft.Json;

namespace Mineswe.io.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private IUserService _userService;
        private ILogger<AuthController> _logger;

        public AuthController(IUserService userService, ILogger<AuthController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        // POST
        [HttpPost("doAuth")]
        public async Task<IActionResult> DoAuth([FromForm] AuthRequest model)
        {
            var response = await _userService.AuthenticateAsync(model);

            if (response == null)
                return BadRequest(new {message = "Invalid Username or Password"});

            return Ok(response);
        }

        //[Authorize(Roles = "Developer,Administrator,Moderator")]
        [Auth("Developer", "Administrator")]
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }
    }
}