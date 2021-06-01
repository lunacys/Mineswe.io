using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Mineswe.io.WebApi.Data;
using Mineswe.io.WebApi.Models;

namespace Mineswe.io.WebApi.Services
{
    public class UserService : IUserService
    {
        private readonly AppSettings _appSettings;
        private readonly IPasswordHasherService _hasher;
        private readonly MinesweioContext _dbContext;

        public UserService(IOptions<AppSettings> appSettings, IPasswordHasherService hasher, MinesweioContext dbContext)
        {
            _appSettings = appSettings.Value;
            _hasher = hasher;
            _dbContext = dbContext;
        }

        public async Task<AuthResponse> AuthenticateAsync(AuthRequest model)
        {
            var user = await _dbContext.Users.Where(u => u.Username == model.Username).SingleOrDefaultAsync();

            if (user == null)
                return null;

            if (!_hasher.Check(user.PasswordHash, model.Password).Verified)
                return null;

            var token = GenerateJwtToken(user);

            return new AuthResponse(user, token);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _dbContext.Users.ToListAsync();
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);
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