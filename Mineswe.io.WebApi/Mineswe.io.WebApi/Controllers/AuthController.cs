﻿using System.Threading.Tasks;
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
        public async Task<IActionResult> DoAuth([FromForm] AuthRequest model)
        {
            var response = await _userService.AuthenticateAsync(model);

            if (response == null)
                return BadRequest(new {message = "Invalid Username or Password"});

            return Ok(response);
        }

        [Auth]
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }
    }
}