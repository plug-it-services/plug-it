using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using YouPlug.Db;
using YouPlug.Models;

namespace YouPlug.Services
{
    public class TubeFetcherService
    {
        private List<UserTubeFetcher> userTubeFetchers = new();

        private List<NewVideoFromChannelModel> newVideoFromChannels = new();
        private List<NewVideoFromMyChannelModel> newVideoFromMyChannels = new();

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

            plugDbContext.NewVideoFromMyChannel.ToList().ForEach(model =>
            {
                AddNewVideoFromMyChannel(model, false);
            });

            Start();
        }

        public void NewVideoFromChannelRoutine()
        {
            newVideoFromChannels.ForEach(model =>
            {
                userTubeFetchers.ForEach(userTubeFetcher =>
                {
                    userTubeFetcher.GetVideos(model.channelId, 1).ForEach(video =>
                    {
                        long nowUnix = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds();
                        long videoUnix = new DateTimeOffset(video.PublishedAt).ToUnixTimeSeconds();

                        Console.WriteLine("Scanned video \"" + video.Title + "\" from " + model.channelId + " for user " + userTubeFetcher.GetAuth().userId + " (published at " + video.PublishedAt + "[UNIX: " + videoUnix + "]");
                        Console.WriteLine("Last video date (from db): " + model.lastVideoDate + " (now: " + nowUnix + ")");

                        if (videoUnix > model.lastVideoDate)
                        {
                            Console.WriteLine("New video from " + model.channelId + " for user " + userTubeFetcher.GetAuth().userId);
                            rabbitService.OnNewVideoFromChannel(model, video);
                            dbContext.NewVideoFromChannel.First(dbModel => dbModel.plugId == model.plugId).lastVideoDate = videoUnix;
                            dbContext.SaveChanges();
                        }
                    });
                });
            });
        }

        public void NewVideoFromMyChannelRoutine()
        {
            newVideoFromMyChannels.ForEach(model =>
            {
                userTubeFetchers.ForEach(userTubeFetcher =>
                {
                    if (userTubeFetcher.GetAuth().userId != model.userId)
                        return;

                    userTubeFetcher.GetVideos(userTubeFetcher.GetMyOwnChannelId(), 1).ForEach(video =>
                    {
                        long nowUnix = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds();
                        long videoUnix = new DateTimeOffset(video.PublishedAt).ToUnixTimeSeconds();

                        Console.WriteLine("Scanned video \"" + video.Title + "\" from my channel for user " + userTubeFetcher.GetAuth().userId + " (published at " + video.PublishedAt + "[UNIX: " + videoUnix + "]");
                        Console.WriteLine("Last video date (from db): " + model.lastVideoDate + " (now: " + nowUnix + ")");

                        if (videoUnix > model.lastVideoDate)
                        {
                            Console.WriteLine("New video from my channel for user " + userTubeFetcher.GetAuth().userId);
                            rabbitService.OnNewVideoFromMyChannel(model, video);
                            dbContext.NewVideoFromMyChannel.First(dbModel => dbModel.plugId == model.plugId).lastVideoDate = videoUnix;
                            dbContext.SaveChanges();
                        }
                    });
                });
            });
        }

        public Task Start()
        {
            return Task.Factory.StartNew(() =>
            {
                while (true)
                {
                    Console.WriteLine("TubeFetcherService: Checking for new videos...");
                    try
                    {
                        NewVideoFromChannelRoutine();
                        NewVideoFromMyChannelRoutine();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine("Error in TubeFetcherService: " + e.Message);
                    }

                    Thread.Sleep(1000 * 60); // 60 seconds
                }
            });
        }

        public void AddUser(YouPlugAuthModel youPlugAuth)
        {
            if (userTubeFetchers.Any(userTubeFetcher => userTubeFetcher.GetAuth().userId == youPlugAuth.userId))
            {
                Console.WriteLine("UserTubeFetcher already exists for user " + youPlugAuth.userId);
                return;
            }
            
            if (!string.IsNullOrWhiteSpace(youPlugAuth.accessToken) && !string.IsNullOrWhiteSpace(youPlugAuth.refreshToken))
            {
                userTubeFetchers.Add(new UserTubeFetcher(youPlugAuth));
                Console.WriteLine("Created UserTubeFetcher for user " + youPlugAuth.userId);
            }
            else
            {
                Console.WriteLine("Unable to create UserTubeFetcher for user " + youPlugAuth.userId + " because of missing tokens");
            }
        }

        public void RemoveUser(uint userId)
        {
            int nb = userTubeFetchers.RemoveAll(userTubeFetcher => userTubeFetcher.GetAuth().userId == userId);
            if (nb == 0)
                Console.WriteLine("No UserTubeFetcher found for user " + userId);
            else
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
            dbContext.SaveChanges();

            if (!string.IsNullOrWhiteSpace(model.channelId))
            {
                newVideoFromChannels.Add(model);
                Console.WriteLine("Added listener on " + model.channelId + " to track new video. (Requested by " + model.userId + " | " + model.plugId + ")");
            }
        }

        public void RemoveNewVideoFromChannel(int userId, string plugId)
        {
            NewVideoFromChannelModel? model = dbContext.NewVideoFromChannel.Find(userId, plugId);
            if (model == null)
            {
                Console.WriteLine("Unable to remove NewVideoFromChannelModel for user " + userId + " and plug " + plugId + " because it doesn't exist");
                return;
            }

            var ent = dbContext.NewVideoFromChannel.Remove(model);
            dbContext.SaveChanges();
            if (ent.State == EntityState.Deleted)
                Console.WriteLine("Removed NewVideoFromChannelModel for user " + userId + " and plug " + plugId);
            else
                Console.WriteLine("Unable to remove NewVideoFromChannelModel for user " + userId + " and plug " + plugId + " because it doesn't exist");

            int cnt = newVideoFromChannels.RemoveAll(newVideoFromChannel => newVideoFromChannel.userId == userId && newVideoFromChannel.plugId == plugId);
            if (cnt == 0)
                Console.WriteLine("Unable to remove listener on " + model.channelId + " to track new video. (Requested by " + model.userId + " | " + model.plugId + ")");
            else
                Console.WriteLine("Removed listener on " + model.channelId + " to track new video. (Requested by " + model.userId + " | " + model.plugId + ")");
        }

        public void AddNewVideoFromMyChannel(NewVideoFromMyChannelModel model, bool registerInDb = true)
        {
            if (registerInDb && dbContext.NewVideoFromMyChannel.Find(model.userId, model.plugId) == null)
            {
                Console.WriteLine("NewVideoFromMyChannelModel not found in database, adding it");
                dbContext.NewVideoFromMyChannel.Add(model);
            }
            else if (registerInDb)
            {
                Console.WriteLine("NewVideoFromMyChannelModel already exists in database, updating it");
                dbContext.NewVideoFromMyChannel.Update(model);
            }
            dbContext.SaveChanges();

            newVideoFromMyChannels.Add(model);
            Console.WriteLine("Added listener on user " + model.userId + " channel to track new video. (Requested by " + model.userId + " | " + model.plugId + ")");
        }

        public void RemoveNewVideoFromMyChannel(int userId, string plugId)
        {
            NewVideoFromMyChannelModel? model = dbContext.NewVideoFromMyChannel.Find(userId, plugId);
            if (model == null)
            {
                Console.WriteLine("Unable to remove NewVideoFromMyChannelModel for user " + userId + " and plug " + plugId + " because it doesn't exist");
                return;
            }

            var ent = dbContext.NewVideoFromMyChannel.Remove(model);
            dbContext.SaveChanges();
            if (ent.State == EntityState.Deleted)
                Console.WriteLine("Removed NewVideoFromMyChannelModel for user " + userId + " and plug " + plugId);
            else
                Console.WriteLine("Unable to remove NewVideoFromMyChannelModel for user " + userId + " and plug " + plugId + " because it doesn't exist");

            int cnt = newVideoFromMyChannels.RemoveAll(newVideoFromMyChannel => newVideoFromMyChannel.userId == userId && newVideoFromMyChannel.plugId == plugId);
            if (cnt == 0)
                Console.WriteLine("Unable to remove listener on user " + model.userId + " channel to track new video. (Requested by " + model.userId + " | " + model.plugId + ")");
            else
                Console.WriteLine("Removed listener on user " + model.userId + " channel to track new video. (Requested by " + model.userId + " | " + model.plugId + ")");
        }
    }
}
