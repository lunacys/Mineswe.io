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

            if (context.Users.Any())
                return;

            var users = new[]
            {
                new User
                {
                    Username = "loonacuse", Email = "loonacuse@gmail.com",
                    PasswordHash = "/LrRkJV05/te0Fxx/hXK1Q==5NtLVcHFw4CcAnDmQuZOD5p/27RbvGDONUKRAd1fvGI=10000",
                    RegistrationDate = DateTime.UtcNow
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