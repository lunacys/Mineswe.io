using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Mineswe.io.WebApi.Data;
using Mineswe.io.WebApi.Models;

namespace Mineswe.io.WebApi.Services
{
    public class UserService : IUserService
    {
        private readonly IPasswordHasherService _hasher;
        private readonly MinesweioContext _dbContext;
        private readonly ITokenGenerator _tokenGenerator;

        public UserService(IPasswordHasherService hasher, MinesweioContext dbContext, ITokenGenerator tokenGenerator)
        {
            _hasher = hasher;
            _dbContext = dbContext;
            _tokenGenerator = tokenGenerator;
        }

        public async Task<AuthResponse> AuthenticateAsync(AuthRequest model)
        {
            var user = await _dbContext.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Username == model.Username);

            if (user == null)
                return null;

            if (!_hasher.Check(user.PasswordHash, model.Password).Verified)
                return null;

            var token = _tokenGenerator.Generate(user);

            return new AuthResponse(user, token);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _dbContext.Users.Include(u => u.Role).ToListAsync();
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await _dbContext.Users.Include(u => u.Role).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<User> GetByUsernameAsync(string username)
        {
            return await _dbContext.Users.Include(u => u.Role).FirstOrDefaultAsync(user => user.Username == username);
        }
    }
}