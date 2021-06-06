using System.Threading.Tasks;
using Mineswe.io.WebApi.Models;

namespace Mineswe.io.WebApi.Services.Authentication
{
    public interface IAuthSerivce
    {
        Task<AuthResponse> AuthAsync(AuthRequest request);
    }
}