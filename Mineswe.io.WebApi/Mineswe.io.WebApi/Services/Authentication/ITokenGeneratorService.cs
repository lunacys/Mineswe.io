using Mineswe.io.WebApi.Models;

namespace Mineswe.io.WebApi.Services.Authentication
{
    public interface ITokenGeneratorService
    {
        string Generate(User user);
    }
}