using System.Collections.Generic;
using Mineswe.io.WebApi.Models;

namespace Mineswe.io.WebApi.Services
{
    public interface IUserService
    {
        AuthResponse Authenticate(AuthRequest model);
        IEnumerable<User> GetAll();
        User GetById(int id);
    }
}