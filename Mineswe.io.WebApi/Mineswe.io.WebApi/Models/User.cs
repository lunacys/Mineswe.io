using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Mineswe.io.WebApi.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [ProtectedPersonalData]
        public string Username { get; set; }
        [ProtectedPersonalData]
        public string Email { get; set; }

        [JsonIgnore]
        [Required]
        public string PasswordHash { get; set; }
    }
}