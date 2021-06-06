using System.Collections.Generic;
using System.Threading.Tasks;
using Mineswe.io.WebApi.Models;

namespace Mineswe.io.WebApi.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetByIdAsync(int id);
        Task<User> GetByUsernameAsync(string username);
        Task<User> GetByEmailAsync(string email);
        Task<User> RegisterAsync(UserRegisterRequest model);
        Task ChangePasswordByIdAsync(int id, string oldPassword, string newPassword);
        Task<User> UpdateAsync(User user);
    }
}