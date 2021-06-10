using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Mineswe.io.WebApi.Data;
using Mineswe.io.WebApi.Models;
using Mineswe.io.WebApi.Services.Authentication;

namespace Mineswe.io.WebApi.Services
{
    public class UserService : IUserService
    {
        private readonly MinesweioContext _dbContext;
        private readonly IPasswordHasherService _hasher;

        public UserService(MinesweioContext dbContext, IPasswordHasherService hasher)
        {
            _dbContext = dbContext;
            _hasher = hasher;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _dbContext.Users.Include(u => u.Role).ToListAsync();
        }

        public async Task<User> GetByIdAsync(int id)
        {
            var user = await _dbContext.Users.Include(u => u.Role).FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
                throw new Exception($"User with id {id} was not found");
            return user;
        }

        public async Task<User> GetByUsernameAsync(string username)
        {
            var user = await _dbContext.Users.Include(u => u.Role).FirstOrDefaultAsync(x => x.Username == username);
            if (user == null)
                throw new Exception($"User with username {username} was not found");
            return user;
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            var user = await _dbContext.Users.Include(u => u.Role).FirstOrDefaultAsync(x => x.Email == email);
            if (user == null)
                throw new Exception($"User with email {email} was not found");
            return user;
        }

        public async Task<User> RegisterAsync(UserRegisterRequest model)
        {
            if (string.IsNullOrEmpty(model.Password))
                throw new Exception("Password is empty");
            if (string.IsNullOrEmpty(model.Username))
                throw new Exception("Username is empty");

            var existing = await _dbContext.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(x => x.Username == model.Username ||
                                          (!string.IsNullOrEmpty(model.Email) && x.Email == model.Email));

            if (existing != null)
            {
                if (existing.Username == model.Username)
                    throw new Exception("User with the same name already exists");
                if (existing.Email == model.Email)
                    throw new Exception("User with the same email already exists");
            }
            
            var hashedPwd = _hasher.Hash(model.Password);

            var userRole = await _dbContext.UserRoles.FirstAsync(role => role.RoleName == UserRoleInfo.User);

            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                Role = userRole,
                RoleId = userRole.Id,
                PasswordHash = hashedPwd,
                RegistrationDate = DateTime.UtcNow
            };

            var result = await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();

            return result.Entity;
        }

        public async Task ChangePasswordByIdAsync(int id, string oldPassword, string newPassword)
        {
            if (string.IsNullOrEmpty(oldPassword))
                throw new Exception("Old Password is empty");
            if (string.IsNullOrEmpty(newPassword))
                throw new Exception("New Password is empty");
            if (oldPassword == newPassword)
                throw new Exception("Passwords are the same");

            var existing = await _dbContext.Users.FindAsync(id);

            if (existing == null)
                throw new Exception("Cannot find user with id " + id);

            if (!_hasher.Check(existing.PasswordHash, oldPassword).Verified)
                throw new Exception("Incorrect old password");

            var hashedPwd = _hasher.Hash(newPassword);
            existing.PasswordHash = hashedPwd;

            _dbContext.Update(existing);
            await _dbContext.SaveChangesAsync();
        }

        public Task<User> UpdateAsync(User user)
        {
            throw new System.NotImplementedException();
        }

        public async Task UpdateRoleByUsernameAsync(string username, string newRoleName)
        {
            if (string.IsNullOrEmpty(username))
                throw new Exception("Username is empty");
            if (string.IsNullOrEmpty(newRoleName))
                throw new Exception("New role name is empty");
            if (!UserRoleInfo.AvailableRoles.Contains(newRoleName))
                throw new Exception("Invalid role name: " + newRoleName);

            var user = await _dbContext.Users.SingleOrDefaultAsync(x => x.Username == username);

            if (user == null)
                throw new Exception("Cannot find user with name " + username);

            var role = await _dbContext.UserRoles.SingleOrDefaultAsync(x => x.RoleName == newRoleName);

            if (role == null)
                throw new Exception("Cannot find role with name " + newRoleName);

            user.Role = role;
            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();
        }
    }
}