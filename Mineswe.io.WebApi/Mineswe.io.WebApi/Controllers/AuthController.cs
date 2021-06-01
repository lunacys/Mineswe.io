using Microsoft.AspNetCore.Mvc;
using Mineswe.io.WebApi.Models;
using Mineswe.io.WebApi.Services;

namespace Mineswe.io.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        // POST
        [HttpPost("doAuth")]
        public IActionResult DoAuth([FromForm] AuthRequest model)
        {
            var response = _userService.Authenticate(model);

            if (response == null)
                return BadRequest(new {message = "Invalid Username or Password"});

            return Ok(response);
        }

        [Auth]
        [HttpGet("getAll")]
        public IActionResult GetAll()
        {
            var users = _userService.GetAll();
            return Ok(users);
        }
    }
}