﻿using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mineswe.io.WebApi.Models;
using Mineswe.io.WebApi.Services;

namespace Mineswe.io.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Get All Users
        /// </summary>
        /// <returns>All Users</returns>
        /// <response code="200">Returns all registered users</response>
        /// <response code="403">Not allowed for current user's role</response>
        /// <response code="500">Internal server error.</response>
        [Auth("Developer", "Administrator")]
        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<User>), 200)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var users = await _userService.GetAllAsync();
                return Ok(users);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(new ErrorResponse {Error = e.Message});
            }
        }

        /// <summary>
        /// Get user by id
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        /// <response code="200">Returns user found by given id</response>
        /// <response code="403">Not allowed for current user's role</response>
        /// <response code="500">Internal server error.</response>
        [Auth("Developer", "Administrator", "Moderator")]
        [HttpGet("[action]")]
        [ProducesResponseType(typeof(User), 200)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetById([FromForm] int userId)
        {
            try
            {
                var user = await _userService.GetByIdAsync(userId);
                return Ok(user);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(new ErrorResponse {Error = e.Message});
            }
        }

        /// <summary>
        /// Get user by username
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        /// <response code="200">Returns user found by given username</response>
        /// <response code="403">Not allowed for current user's role</response>
        /// <response code="500">Internal server error.</response>
        [Auth("Developer", "Administrator", "Moderator")]
        [HttpGet("[action]")]
        [ProducesResponseType(typeof(User), 200)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetByUsername([FromForm] string username)
        {
            try
            {
                var user = await _userService.GetByUsernameAsync(username);
                return Ok(user);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(new ErrorResponse { Error = e.Message });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        /// <response code="200">Returns user found by given email</response>
        /// <response code="403">Not allowed for current user's role</response>
        /// <response code="500">Internal server error.</response>
        [Auth("Developer", "Administrator", "Moderator")]
        [HttpGet("[action]")]
        [ProducesResponseType(typeof(User), 200)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetByEmail([FromForm] string email)
        {
            try
            {
                var user = await _userService.GetByEmailAsync(email);
                return Ok(user);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(new ErrorResponse { Error = e.Message });
            }
        }

        /// <summary>
        /// Registers a new user with given username (required), password (required) and email (not required)
        /// </summary>
        /// <param name="user">User register request: username, password and email</param>
        /// <returns><see cref="User"/></returns>
        /// <response code="200">Returns success response</response>
        /// <response code="403">Not allowed for current user's role</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost("[action]")]
        [ProducesResponseType(typeof(User), 200)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register([FromForm] UserRegisterRequest user)
        {
            try
            {
                var u = await _userService.RegisterAsync(user);
                return Ok(u);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(new ErrorResponse{Error = e.Message});
            }
        }

        [Auth("Developer", "Administrator", "Moderator")]
        [HttpPost("[action]")]
        [ProducesResponseType(typeof(SuccessResponse), 200)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ChangePasswordById([FromForm] int userId, [FromForm] string oldPassword, [FromForm] string newPassword)
        {
            try
            {
                await _userService.ChangePasswordByIdAsync(userId, oldPassword, newPassword);
                return Ok(new SuccessResponse{Message = "Success"});
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(new ErrorResponse{Error = e.Message});
            }
        }

        /// <summary>
        /// Changes password by given username
        /// </summary>
        /// <param name="username">Username</param>
        /// <param name="oldPassword">Old password</param>
        /// <param name="newPassword">New password</param>
        /// <returns>Success or BadRequest</returns>
        [Auth("Developer", "Administrator", "Moderator")]
        [HttpPost("[action]")]
        [ProducesResponseType(typeof(SuccessResponse), 200)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ChangePasswordByUsername([FromForm] string username, [FromForm] string oldPassword, [FromForm] string newPassword)
        {
            try
            {
                var user = await _userService.GetByUsernameAsync(username);
                await _userService.ChangePasswordByIdAsync(user.Id, oldPassword, newPassword);
                return Ok(new SuccessResponse{ Message = "Success" });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(new ErrorResponse{ Error = e.Message });
            }
        }

        [Auth]
        [HttpPost("[action]")]
        [ProducesResponseType(typeof(SuccessResponse), 200)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ChangePassword([FromForm] string oldPassword, [FromForm] string newPassword)
        {
            try
            {
                var usernameClaim = HttpContext.User.FindFirst(ClaimsIdentity.DefaultNameClaimType);

                if (usernameClaim == null)
                    return BadRequest(new ErrorResponse { Error = "Invalid claim"});

                var user = await _userService.GetByUsernameAsync(usernameClaim.Value);

                if (user == null)
                    return BadRequest(new ErrorResponse {Error = "No user found for current claim: " + usernameClaim.Value});

                await _userService.ChangePasswordByIdAsync(user.Id, oldPassword, newPassword);
                
                return Ok(new SuccessResponse { Message = "Success"} );
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(new ErrorResponse {Error = e.Message});
            }
        }
    }
}