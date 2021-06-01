using System.ComponentModel.DataAnnotations;

namespace Mineswe.io.WebApi.Models
{
    public class AuthRequest
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}