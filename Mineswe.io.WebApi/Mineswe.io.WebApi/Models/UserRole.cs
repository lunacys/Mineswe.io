using System.ComponentModel.DataAnnotations;

namespace Mineswe.io.WebApi.Models
{
    public class UserRole
    {
        [Key]
        public int Id { get; set; }

        public string RoleName { get; set; }
    }
}