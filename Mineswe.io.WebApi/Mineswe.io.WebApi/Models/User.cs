using System;
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
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime RegistrationDate { get; set; }

        [JsonIgnore]
        [Required]
        [DataType(DataType.Password)]
        public string PasswordHash { get; set; }
    }
}