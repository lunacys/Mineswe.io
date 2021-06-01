using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Mineswe.io.WebApi.Models;

namespace Mineswe.io.WebApi.Services
{
    public class UserService : IUserService
    {
        // TODO: REMOVE SEEDED USERS!!!
        private List<User> _seedUsers;

        private readonly AppSettings _appSettings;
        private readonly IPasswordHasherService _hasher;

        public UserService(IOptions<AppSettings> appSettings, IPasswordHasherService hasher)
        {
            _appSettings = appSettings.Value;
            _hasher = hasher;

            _seedUsers = new List<User>
            {
                new User {Id = 1, Username = "SeedTest1", Email = "noemail@nodomain.com", PasswordHash = _hasher.Hash("masterkey") }
            };
        }

        public AuthResponse Authenticate(AuthRequest model)
        {
            // var hashed = _hasher.Hash(model.Password);

            var user = _seedUsers.SingleOrDefault(x => 
                x.Username == model.Username && 
                _hasher.Check(x.PasswordHash, model.Password).Verified);

            if (user == null)
                return null;

            var token = GenerateJwtToken(user);

            return new AuthResponse(user, token);
        }

        public IEnumerable<User> GetAll()
        {
            return _seedUsers;
        }

        public User GetById(int id)
        {
            return _seedUsers.FirstOrDefault(x => x.Id == id);
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new [] { new Claim("id", user.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}