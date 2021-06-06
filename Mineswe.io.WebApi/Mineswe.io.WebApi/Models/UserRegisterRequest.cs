using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Mineswe.io.WebApi.Models
{
    public class UserRegisterRequest
    {
        [JsonRequired]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }
        
        public string Email { get; set; }
        [JsonRequired]
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}