using System.Collections.Generic;
using System.Threading.Tasks;
using Mineswe.io.WebApi.Models;

namespace Mineswe.io.WebApi.Services
{
    public interface IUserService
    {
        Task<AuthResponse> AuthenticateAsync(AuthRequest model);
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetByIdAsync(int id);
        Task<User> GetByUsernameAsync(string username);
    }
}