using Mineswe.io.WebApi.Models;

namespace Mineswe.io.WebApi.Services
{
    public interface ITokenGenerator
    {
        string Generate(User user);
    }
}