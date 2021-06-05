using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Mineswe.io.WebApi.Models;

namespace Mineswe.io.WebApi
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public sealed class AuthAttribute : Attribute, IAuthorizationFilter
    {
        public IEnumerable<string> Roles { get; set; }

        public AuthAttribute()
        {
            Roles = null;
        }

        public AuthAttribute(params string[] roles)
        {
            Roles = roles;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var userClaims = context.HttpContext.User.Claims.ToList();

            if (!userClaims.Any())
            {
                context.Result = new JsonResult(new { message = "Unauthorized" })
                {
                    StatusCode = StatusCodes.Status401Unauthorized
                };

                return;
            }

            if (!userClaims.Any(claim =>
                claim.Type == ClaimsIdentity.DefaultRoleClaimType && Roles.Contains(claim.Value)))
            {
                context.Result = new JsonResult(new { message = "No Access Rights" })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
            }
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            /*var user = (User) context.HttpContext.Items["User"];

            if (user == null)
            {
                context.Result = new JsonResult(new { message = "Unauthorized" })
                {
                    StatusCode = StatusCodes.Status401Unauthorized
                };

                return;
            }

            if (user.Role == null)
            {
                context.Result = new JsonResult(new {message = "Role is not set"})
                {
                    StatusCode = StatusCodes.Status401Unauthorized
                };

                return;
            }

            if (Roles != null && !Roles.Contains(user.Role.RoleName))
            {
                context.Result = new JsonResult(new { message = "No Access Rights" })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
            }*/
        }

        
    }
}
