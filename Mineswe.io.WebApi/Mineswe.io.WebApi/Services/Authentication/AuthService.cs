using System.Threading.Tasks;
using Mineswe.io.WebApi.Models;

namespace Mineswe.io.WebApi.Services.Authentication
{
    public class AuthService : IAuthSerivce
    {
        private readonly IUserService _userService;
        private readonly IPasswordHasherService _hasher;
        private readonly ITokenGeneratorService _tokenGenerator;

        public AuthService(IUserService userService, IPasswordHasherService hasher, ITokenGeneratorService tokenGenerator)
        {
            _userService = userService;
            _hasher = hasher;
            _tokenGenerator = tokenGenerator;
        }

        public async Task<AuthResponse> AuthAsync(AuthRequest request)
        {
            var user = await _userService.GetByUsernameAsync(request.Username);

            if (user == null)
                return null;

            if (!_hasher.Check(user.PasswordHash, request.Password).Verified)
                return null;

            var token = _tokenGenerator.Generate(user);

            return new AuthResponse(user, token);
        }
    }
}