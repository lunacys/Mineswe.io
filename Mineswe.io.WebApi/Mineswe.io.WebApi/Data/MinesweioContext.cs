using Microsoft.EntityFrameworkCore;
using Mineswe.io.WebApi.Models;

namespace Mineswe.io.WebApi.Data
{
    public class MinesweioContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public MinesweioContext(DbContextOptions<MinesweioContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().ToTable("User");
        }
    }
}