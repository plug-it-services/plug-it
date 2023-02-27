using System.Diagnostics;
using YouPlug.Db;
using YouPlug.Models;

namespace YouPlug.Services
{
    public class TubeFetcherService
    {
        private List<UserTubeFetcher> userTubeFetchers = new();

        private List<NewVideoFromChannelModel> newVideoFromChannels = new();

        private PlugDbContext dbContext;
        private RabbitService rabbitService;

        public TubeFetcherService(PlugDbContext plugDbContext)
        {
            dbContext = plugDbContext;

            string? rabbitMq = Environment.GetEnvironmentVariable("RABBITMQ_URL", EnvironmentVariableTarget.Process);

            if (string.IsNullOrWhiteSpace(rabbitMq))
                throw new Exception("Unable to recover RABBITMQ_URL env var!");
            
            rabbitService = new RabbitService(new Uri(rabbitMq));
            rabbitService.Start();

            // First load all registered users
            plugDbContext.Auths.ToList().ForEach(model =>
            {
                AddUser(model);
            });

            // Then check for every action
            plugDbContext.NewVideoFromChannel.ToList().ForEach(model =>
            {
                AddNewVideoFromChannel(model, false);
            });
        }

        public void AddUser(YouPlugAuthModel youPlugAuth)
        {
            if (!string.IsNullOrWhiteSpace(youPlugAuth.accessToken) && !string.IsNullOrWhiteSpace(youPlugAuth.refreshToken))
            {
                userTubeFetchers.Add(new UserTubeFetcher(youPlugAuth));
                Console.WriteLine("Created UserTubeFetcher for user " + youPlugAuth.userId);
            }
        }

        public void RemoveUser(uint userId)
        {
            userTubeFetchers.RemoveAll(userTubeFetcher => userTubeFetcher.GetAuth().userId == userId);
            Console.WriteLine("Removed UserTubeFetcher for user " + userId);
        }

        public void AddNewVideoFromChannel(NewVideoFromChannelModel model, bool registerInDb = true)
        {
            if (registerInDb && dbContext.NewVideoFromChannel.Find(model.userId, model.plugId) == null)
            {
                Console.WriteLine("NewVideoFromChannelModel not found in database, adding it");
                dbContext.NewVideoFromChannel.Add(model);
            } else if (registerInDb)
            {
                Console.WriteLine("NewVideoFromChannelModel already exists in database, updating it");
                dbContext.NewVideoFromChannel.Update(model);
            }

            if (!string.IsNullOrWhiteSpace(model.channelId))
            {
                newVideoFromChannels.Add(model);
                Console.WriteLine("Added listener on " + model.channelId + " to track new video. (Requested by " + model.userId + " | " + model.plugId + ")");
            }
        }
    }
}
