using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

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
    }
}
