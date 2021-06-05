using System;
using System.Linq;
using Mineswe.io.WebApi.Data;
using Mineswe.io.WebApi.Models;

namespace Mineswe.io.WebApi
{
    public static class DbInitializer
    {
        public static void Initialize(MinesweioContext context)
        {
            context.Database.EnsureCreated();

            if (!context.UserRoles.Any())
            {
                var roles = new[]
                {
                    new UserRole { RoleName = "Developer"},
                    new UserRole { RoleName = "Administrator"},
                    new UserRole { RoleName = "Moderator"},
                    new UserRole { RoleName = "Supporter"},
                    new UserRole { RoleName = "User"},
                    new UserRole { RoleName = "Guest"}
                };

                foreach (var role in roles)
                {
                    context.UserRoles.Add(role);
                }

                context.SaveChanges();
            }

            if (!context.Users.Any())
            {
                var devRole = context.UserRoles.First(role => role.RoleName == "Developer");

                var users = new[]
                {
                    new User
                    {
                        Username = "loonacuse", Email = "loonacuse@gmail.com",
                        PasswordHash = "/LrRkJV05/te0Fxx/hXK1Q==5NtLVcHFw4CcAnDmQuZOD5p/27RbvGDONUKRAd1fvGI=10000",
                        RegistrationDate = DateTime.UtcNow,
                        Role = devRole
                    }
                };

                foreach (var user in users)
                {
                    context.Users.Add(user);
                }

                context.SaveChanges();
            }
        }
    }
}