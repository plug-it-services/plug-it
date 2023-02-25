using Microsoft.EntityFrameworkCore;
using YouPlug.Models;

namespace YouPlug.Db
{
    public class PlugDbContext : DbContext
    {
        public PlugDbContext(DbContextOptions<PlugDbContext> options) : base(options)
        {
            if (Database.EnsureCreated()){
                Console.WriteLine("Database created");
                Console.WriteLine("Database created");
            } else {
                Console.WriteLine("Database already exists");
                Console.WriteLine("Database already exists");
            }
            Database.Migrate();
        }

        public DbSet<YouPlugAuthModel> Auths { get; set; }
        public DbSet<NewVideoFromChannelModel> NewVideoFromChannel { get; set; }
    }
}
