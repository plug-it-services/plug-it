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
        public DbSet<NewVideoFromMyChannelModel> NewVideoFromMyChannel { get; set; }

        public DbSet<NewStreamFromChannelModel> NewStreamFromChannel { get; set; }
        public DbSet<NewStreamFromMyChannelModel> NewStreamFromMyChannel { get; set; }

        public DbSet<NewUpcomingFromChannelModel> NewUpcomingFromChannel { get; set; }
        public DbSet<NewUpcomingFromMyChannelModel> NewUpcomingFromMyChannel { get; set; }
    }
}
