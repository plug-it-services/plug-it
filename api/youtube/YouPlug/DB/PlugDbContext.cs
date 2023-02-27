using Microsoft.EntityFrameworkCore;
using YouPlug.Models;

namespace YouPlug.Db
{
    public class PlugDbContext : DbContext
    {
        public PlugDbContext(DbContextOptions<PlugDbContext> options) : base(options)
        {
        }

        public DbSet<YouPlugAuthModel> Auths { get; set; }
        public DbSet<NewVideoFromChannelModel> NewVideoFromChannel { get; set; }
    }
}
