using Microsoft.EntityFrameworkCore;
using YouPlug.Models;

namespace YouPlug
{
    public class PlugDbContext : DbContext
    {
        public PlugDbContext(DbContextOptions<PlugDbContext> options) : base(options)
        {
        }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<WebHookModel> WebHooks { get; set; }
    }
}
