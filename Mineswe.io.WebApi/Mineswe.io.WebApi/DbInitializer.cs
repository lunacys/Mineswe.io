using System;
using System.Linq;
using Mineswe.io.WebApi.Configurations;
using Mineswe.io.WebApi.Data;
using Mineswe.io.WebApi.Models;

namespace Mineswe.io.WebApi
{
    public static class DbInitializer
    {
        public static void Initialize(MinesweioContext context, AppSettings settings)
        {
            context.Database.EnsureCreated();

            if (!context.UserRoles.Any())
            {
                var roles = UserRoleInfo.AvailableRoles;

                foreach (var role in roles)
                {
                    context.UserRoles.Add(new UserRole {RoleName = role});
                }

                context.SaveChanges();
            }

            if (!context.Users.Any())
            {
                var devRole = context.UserRoles.First(role => role.RoleName == UserRoleInfo.Developer);

                var users = new[]
                {
                    new User
                    {
                        Username = settings.DefaultUserName, Email = settings.DefaultUserEmail,
                        PasswordHash = settings.DefaultUserPasswordHash,
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