namespace Mineswe.io.WebApi.Services.Authentication
{
    public interface IPasswordHasherService
    {
        string Hash(string password);
        (bool Verified, bool NeedsUpgrade) Check(string hash, string password);
    }
}