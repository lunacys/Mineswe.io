using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

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
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime RegistrationDate { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [JsonIgnore]
        public string PasswordHash { get; set; }

        [JsonIgnore]
        [NotMapped]
        public string Password { get; set; }

        public int RoleId { get; set; }
        [Required]
        public UserRole Role { get; set; }
    }
}