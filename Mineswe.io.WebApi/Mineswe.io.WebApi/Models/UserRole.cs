using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Mineswe.io.WebApi.Models
{
    public class UserRole
    {
        [Key]
        public int Id { get; set; }

        public string RoleName { get; set; }
    }

    public static class UserRoleInfo
    {
        public static readonly string Developer = "Developer";
        public static readonly string Administrator = "Administrator";
        public static readonly string Moderator = "Moderator"; 
        public static readonly string Supporter = "Supporter";
        public static readonly string User = "User";
        public static readonly string Guest = "Guest";

        public static readonly IEnumerable<string> AvailableRoles = new[]
            {Developer, Administrator, Moderator, Supporter, User, Guest};
    }
}