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

        private List<NewStreamFromChannelModel> newStreamFromChannels = new();
        private List<NewStreamFromMyChannelModel> newStreamFromMyChannels = new();

        private List<NewUpcomingFromChannelModel> newUpcomingFromChannels = new();
        private List<NewUpcomingFromMyChannelModel> newUpcomingFromMyChannels = new();

        private PlugDbContext dbContext;
        private RabbitService rabbitService;

        public TubeFetcherService(PlugDbContext plugDbContext)
        {
            dbContext = plugDbContext;

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

            plugDbContext.NewStreamFromChannel.ToList().ForEach(model =>
            {
                AddNewStreamFromChannel(model, false);
            });

            plugDbContext.NewStreamFromMyChannel.ToList().ForEach(model =>
            {
                AddNewStreamFromMyChannel(model, false);
            });

            plugDbContext.NewUpcomingFromChannel.ToList().ForEach(model =>
            {
                AddNewUpcomingFromChannel(model, false);
            });

            plugDbContext.NewUpcomingFromMyChannel.ToList().ForEach(model =>
            {
                AddNewUpcomingFromMyChannel(model, false);
            });
        }

        public void NewVideoFromChannelRoutine()
        {
            newVideoFromChannels.ForEach(model =>
            {
                userTubeFetchers.ForEach(userTubeFetcher =>
                {
                    userTubeFetcher.GetVideos(model.channelId, 1, Google.Apis.YouTube.v3.SearchResource.ListRequest.EventTypeEnum.None).ForEach(video =>
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

                    userTubeFetcher.GetVideos(userTubeFetcher.GetMyOwnChannelId(), 1, Google.Apis.YouTube.v3.SearchResource.ListRequest.EventTypeEnum.None).ForEach(video =>
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

        public void NewStreamFromChannelRoutine()
        {
            newStreamFromChannels.ForEach(model =>
            {
                userTubeFetchers.ForEach(userTubeFetcher =>
                {
                    userTubeFetcher.GetVideos(model.channelId, 1, Google.Apis.YouTube.v3.SearchResource.ListRequest.EventTypeEnum.Live).ForEach(video =>
                    {
                        long nowUnix = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds();
                        long videoUnix = new DateTimeOffset(video.PublishedAt).ToUnixTimeSeconds();

                        Console.WriteLine("Scanned stream \"" + video.Title + "\" from " + model.channelId + " for user " + userTubeFetcher.GetAuth().userId + " (published at " + video.PublishedAt + "[UNIX: " + videoUnix + "]");
                        Console.WriteLine("Last stream date (from db): " + model.lastStreamDate + " (now: " + nowUnix + ")");

                        if (videoUnix > model.lastStreamDate)
                        {
                            Console.WriteLine("New stream from " + model.channelId + " for user " + userTubeFetcher.GetAuth().userId);
                            rabbitService.OnNewStreamFromChannel(model, video);
                            dbContext.NewStreamFromChannel.First(dbModel => dbModel.plugId == model.plugId).lastStreamDate = videoUnix;
                            dbContext.SaveChanges();
                        }
                    });
                });
            });
        }

        public void NewStreamFromMyChannelRoutine()
        {
            newStreamFromMyChannels.ForEach(model =>
            {
                userTubeFetchers.ForEach(userTubeFetcher =>
                {
                    if (userTubeFetcher.GetAuth().userId != model.userId)
                        return;

                    userTubeFetcher.GetVideos(userTubeFetcher.GetMyOwnChannelId(), 1, Google.Apis.YouTube.v3.SearchResource.ListRequest.EventTypeEnum.Live).ForEach(video =>
                    {
                        long nowUnix = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds();
                        long videoUnix = new DateTimeOffset(video.PublishedAt).ToUnixTimeSeconds();

                        Console.WriteLine("Scanned stream \"" + video.Title + "\" from my channel for user " + userTubeFetcher.GetAuth().userId + " (published at " + video.PublishedAt + "[UNIX: " + videoUnix + "]");
                        Console.WriteLine("Last stream date (from db): " + model.lastStreamDate + " (now: " + nowUnix + ")");

                        if (videoUnix > model.lastStreamDate)
                        {
                            Console.WriteLine("New stream from my channel for user " + userTubeFetcher.GetAuth().userId);
                            rabbitService.OnNewStreamFromMyChannel(model, video);
                            dbContext.NewStreamFromMyChannel.First(dbModel => dbModel.plugId == model.plugId).lastStreamDate = videoUnix;
                            dbContext.SaveChanges();
                        }
                    });
                });
            });
        }

        public void NewUpcomingFromChannelRoutine()
        {
            newUpcomingFromChannels.ForEach(model =>
            {
                userTubeFetchers.ForEach(userTubeFetcher =>
                {
                    userTubeFetcher.GetVideos(model.channelId, 1, Google.Apis.YouTube.v3.SearchResource.ListRequest.EventTypeEnum.Upcoming).ForEach(video =>
                    {
                        long nowUnix = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds();
                        long videoUnix = new DateTimeOffset(video.PublishedAt).ToUnixTimeSeconds();

                        Console.WriteLine("Scanned upcoming \"" + video.Title + "\" from " + model.channelId + " for user " + userTubeFetcher.GetAuth().userId + " (published at " + video.PublishedAt + "[UNIX: " + videoUnix + "]");
                        Console.WriteLine("Last upcoming content date (from db): " + model.lastUpcomingDate + " (now: " + nowUnix + ")");

                        if (videoUnix > model.lastUpcomingDate)
                        {
                            Console.WriteLine("New upcoming content from " + model.channelId + " for user " + userTubeFetcher.GetAuth().userId);
                            rabbitService.OnNewUpcomingFromChannel(model, video);
                            dbContext.NewUpcomingFromChannel.First(dbModel => dbModel.plugId == model.plugId).lastUpcomingDate = videoUnix;
                            dbContext.SaveChanges();
                        }
                    });
                });
            });
        }

        public void NewUpcomingFromMyChannelRoutine()
        {
            newUpcomingFromMyChannels.ForEach(model =>
            {
                userTubeFetchers.ForEach(userTubeFetcher =>
                {
                    if (userTubeFetcher.GetAuth().userId != model.userId)
                        return;

                    userTubeFetcher.GetVideos(userTubeFetcher.GetMyOwnChannelId(), 1, Google.Apis.YouTube.v3.SearchResource.ListRequest.EventTypeEnum.Upcoming).ForEach(video =>
                    {
                        long nowUnix = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds();
                        long videoUnix = new DateTimeOffset(video.PublishedAt).ToUnixTimeSeconds();

                        Console.WriteLine("Scanned upcoming \"" + video.Title + "\" from my channel for user " + userTubeFetcher.GetAuth().userId + " (published at " + video.PublishedAt + "[UNIX: " + videoUnix + "]");
                        Console.WriteLine("Last upcoming content date (from db): " + model.lastUpcomingDate + " (now: " + nowUnix + ")");

                        if (videoUnix > model.lastUpcomingDate)
                        {
                            Console.WriteLine("New upcoming content from my channel for user " + userTubeFetcher.GetAuth().userId);
                            rabbitService.OnNewUpcomingFromMyChannel(model, video);
                            dbContext.NewUpcomingFromMyChannel.First(dbModel => dbModel.plugId == model.plugId).lastUpcomingDate = videoUnix;
                            dbContext.SaveChanges();
                        }
                    });
                });
            });
        }


        public Task Start()
        {
            string? rabbitMq = Environment.GetEnvironmentVariable("RABBITMQ_URL", EnvironmentVariableTarget.Process);

            if (string.IsNullOrWhiteSpace(rabbitMq))
                throw new Exception("Unable to recover RABBITMQ_URL env var!");
            
            rabbitService = new RabbitService(new Uri(rabbitMq));
            rabbitService.Start();
            
            return Task.Factory.StartNew(() =>
            {
                while (true)
                {
                    Console.WriteLine("TubeFetcherService: Checking...");
                    try
                    {
                        NewVideoFromChannelRoutine();
                        NewVideoFromMyChannelRoutine();
                        NewStreamFromChannelRoutine();
                        NewStreamFromMyChannelRoutine();
                        NewUpcomingFromChannelRoutine();
                        NewUpcomingFromMyChannelRoutine();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine("Error in TubeFetcherService: " + e.ToString());
                    }

                    Thread.Sleep(1000 * 60 * 5); // 5 min
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

        public void RemoveUser(uint userId, bool removeDbEntries = false)
        {
            int nb = userTubeFetchers.RemoveAll(userTubeFetcher => userTubeFetcher.GetAuth().userId == userId);
            if (nb == 0)
                Console.WriteLine("No UserTubeFetcher found for user " + userId);
            else
                Console.WriteLine("Removed UserTubeFetcher for user " + userId);

            newVideoFromChannels.RemoveAll(model => model.userId == userId);
            newVideoFromMyChannels.RemoveAll(model => model.userId == userId);
            newStreamFromChannels.RemoveAll(model => model.userId == userId);
            newStreamFromMyChannels.RemoveAll(model => model.userId == userId);
            newUpcomingFromChannels.RemoveAll(model => model.userId == userId);
            newUpcomingFromMyChannels.RemoveAll(model => model.userId == userId);

            if (removeDbEntries)
            {
                dbContext.NewVideoFromChannel.RemoveRange(dbContext.NewVideoFromChannel.Where(model => model.userId == userId));
                dbContext.NewVideoFromMyChannel.RemoveRange(dbContext.NewVideoFromMyChannel.Where(model => model.userId == userId));
                dbContext.NewStreamFromChannel.RemoveRange(dbContext.NewStreamFromChannel.Where(model => model.userId == userId));
                dbContext.NewStreamFromMyChannel.RemoveRange(dbContext.NewStreamFromMyChannel.Where(model => model.userId == userId));
                dbContext.NewUpcomingFromChannel.RemoveRange(dbContext.NewUpcomingFromChannel.Where(model => model.userId == userId));
                dbContext.NewUpcomingFromMyChannel.RemoveRange(dbContext.NewUpcomingFromMyChannel.Where(model => model.userId == userId));
                dbContext.SaveChanges();
            }
        }  
        
        public void AddNewVideoFromChannel(NewVideoFromChannelModel model, bool registerInDb = true)
        {
            if (registerInDb && dbContext.NewVideoFromChannel.Find(model.userId, model.plugId) == null)
            {
                Console.WriteLine("NewVideoFromChannelModel not found in database, adding it");
                dbContext.NewVideoFromChannel.Add(model);
                dbContext.SaveChanges();
            } else if (registerInDb)
            {
                Console.WriteLine("NewVideoFromChannelModel already exists in database, updating it");
                dbContext.NewVideoFromChannel.Update(model);
                dbContext.SaveChanges();
            }

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
                dbContext.SaveChanges();
            }
            else if (registerInDb)
            {
                Console.WriteLine("NewVideoFromMyChannelModel already exists in database, updating it");
                dbContext.NewVideoFromMyChannel.Update(model);
                dbContext.SaveChanges();
            }

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

        public void AddNewStreamFromChannel(NewStreamFromChannelModel model, bool registerInDb = true)
        {
            if (registerInDb && dbContext.NewStreamFromChannel.Find(model.userId, model.plugId) == null)
            {
                Console.WriteLine("NewStreamFromChannelModel not found in database, adding it");
                dbContext.NewStreamFromChannel.Add(model);
                dbContext.SaveChanges();
            }
            else if (registerInDb)
            {
                Console.WriteLine("NewStreamFromChannelModel already exists in database, updating it");
                dbContext.NewStreamFromChannel.Update(model);
                dbContext.SaveChanges();
            }

            if (!string.IsNullOrWhiteSpace(model.channelId))
            {
                newStreamFromChannels.Add(model);
                Console.WriteLine("Added listener on " + model.channelId + " to track new stream. (Requested by " + model.userId + " | " + model.plugId + ")");
            }
        }

        public void RemoveNewStreamFromChannel(int userId, string plugId)
        {
            NewStreamFromChannelModel? model = dbContext.NewStreamFromChannel.Find(userId, plugId);
            if (model == null)
            {
                Console.WriteLine("Unable to remove NewStreamFromChannelModel for user " + userId + " and plug " + plugId + " because it doesn't exist");
                return;
            }

            var ent = dbContext.NewStreamFromChannel.Remove(model);
            dbContext.SaveChanges();
            if (ent.State == EntityState.Deleted)
                Console.WriteLine("Removed NewStreamFromChannelModel for user " + userId + " and plug " + plugId);
            else
                Console.WriteLine("Unable to remove NewStreamFromChannelModel for user " + userId + " and plug " + plugId + " because it doesn't exist");

            int cnt = newStreamFromChannels.RemoveAll(newStreamFromChannel => newStreamFromChannel.userId == userId && newStreamFromChannel.plugId == plugId);
            if (cnt == 0)
                Console.WriteLine("Unable to remove listener on " + model.channelId + " to track new stream. (Requested by " + model.userId + " | " + model.plugId + ")");
            else
                Console.WriteLine("Removed listener on " + model.channelId + " to track new stream. (Requested by " + model.userId + " | " + model.plugId + ")");
        }

        public void AddNewStreamFromMyChannel(NewStreamFromMyChannelModel model, bool registerInDb = true)
        {
            if (registerInDb && dbContext.NewStreamFromMyChannel.Find(model.userId, model.plugId) == null)
            {
                Console.WriteLine("NewStreamFromMyChannelModel not found in database, adding it");
                dbContext.NewStreamFromMyChannel.Add(model);
                dbContext.SaveChanges();
            }
            else if (registerInDb)
            {
                Console.WriteLine("NewStreamFromMyChannelModel already exists in database, updating it");
                dbContext.NewStreamFromMyChannel.Update(model);
                dbContext.SaveChanges();
            }

            newStreamFromMyChannels.Add(model);
            Console.WriteLine("Added listener on user " + model.userId + " channel to track new stream. (Requested by " + model.userId + " | " + model.plugId + ")");
        }

        public void RemoveNewStreamFromMyChannel(int userId, string plugId)
        {
            NewStreamFromMyChannelModel? model = dbContext.NewStreamFromMyChannel.Find(userId, plugId);
            if (model == null)
            {
                Console.WriteLine("Unable to remove NewStreamFromMyChannelModel for user " + userId + " and plug " + plugId + " because it doesn't exist");
                return;
            }

            var ent = dbContext.NewStreamFromMyChannel.Remove(model);
            dbContext.SaveChanges();
            if (ent.State == EntityState.Deleted)
                Console.WriteLine("Removed NewStreamFromMyChannelModel for user " + userId + " and plug " + plugId);
            else
                Console.WriteLine("Unable to remove NewStreamFromMyChannelModel for user " + userId + " and plug " + plugId + " because it doesn't exist");

            int cnt = newStreamFromMyChannels.RemoveAll(newStreamFromMyChannel => newStreamFromMyChannel.userId == userId && newStreamFromMyChannel.plugId == plugId);
            if (cnt == 0)
                Console.WriteLine("Unable to remove listener on user " + model.userId + " channel to track new stream. (Requested by " + model.userId + " | " + model.plugId + ")");
            else
                Console.WriteLine("Removed listener on user " + model.userId + " channel to track new stream. (Requested by " + model.userId + " | " + model.plugId + ")");
        }

        public void AddNewUpcomingFromChannel(NewUpcomingFromChannelModel model, bool registerInDb = true)
        {
            if (registerInDb && dbContext.NewUpcomingFromChannel.Find(model.userId, model.plugId) == null)
            {
                Console.WriteLine("NewUpcomingFromChannelModel not found in database, adding it");
                dbContext.NewUpcomingFromChannel.Add(model);
                dbContext.SaveChanges();
            }
            else if (registerInDb)
            {
                Console.WriteLine("NewUpcomingFromChannelModel already exists in database, updating it");
                dbContext.NewUpcomingFromChannel.Update(model);
                dbContext.SaveChanges();
            }

            if (!string.IsNullOrWhiteSpace(model.channelId))
            {
                newUpcomingFromChannels.Add(model);
                Console.WriteLine("Added listener on " + model.channelId + " to track new upcoming. (Requested by " + model.userId + " | " + model.plugId + ")");
            }
        }

        public void RemoveUpcomingFromChannel(int userId, string plugId)
        {
            NewUpcomingFromChannelModel? model = dbContext.NewUpcomingFromChannel.Find(userId, plugId);
            if (model == null)
            {
                Console.WriteLine("Unable to remove NewUpcomingFromChannelModel for user " + userId + " and plug " + plugId + " because it doesn't exist");
                return;
            }

            var ent = dbContext.NewUpcomingFromChannel.Remove(model);
            dbContext.SaveChanges();
            if (ent.State == EntityState.Deleted)
                Console.WriteLine("Removed NewUpcomingFromChannelModel for user " + userId + " and plug " + plugId);
            else
                Console.WriteLine("Unable to remove NewUpcomingFromChannelModel for user " + userId + " and plug " + plugId + " because it doesn't exist");

            int cnt = newUpcomingFromChannels.RemoveAll(newUpcomingFromChannel => newUpcomingFromChannel.userId == userId && newUpcomingFromChannel.plugId == plugId);
            if (cnt == 0)
                Console.WriteLine("Unable to remove listener on " + model.channelId + " to track new upcoming. (Requested by " + model.userId + " | " + model.plugId + ")");
            else
                Console.WriteLine("Removed listener on " + model.channelId + " to track new upcoming. (Requested by " + model.userId + " | " + model.plugId + ")");
        }

        public void AddNewUpcomingFromMyChannel(NewUpcomingFromMyChannelModel model, bool registerInDb = true)
        {
            if (registerInDb && dbContext.NewUpcomingFromMyChannel.Find(model.userId, model.plugId) == null)
            {
                Console.WriteLine("NewUpcomingFromMyChannelModel not found in database, adding it");
                dbContext.NewUpcomingFromMyChannel.Add(model);
                dbContext.SaveChanges();
            }
            else if (registerInDb)
            {
                Console.WriteLine("NewUpcomingFromMyChannelModel already exists in database, updating it");
                dbContext.NewUpcomingFromMyChannel.Update(model);
                dbContext.SaveChanges();
            }

            newUpcomingFromMyChannels.Add(model);
            Console.WriteLine("Added listener on user " + model.userId + " channel to track new upcoming. (Requested by " + model.userId + " | " + model.plugId + ")");
        }

        public void RemoveNewUpcomingFromMyChannel(int userId, string plugId)
        {
            NewUpcomingFromMyChannelModel? model = dbContext.NewUpcomingFromMyChannel.Find(userId, plugId);
            if (model == null)
            {
                Console.WriteLine("Unable to remove NewUpcomingFromMyChannelModel for user " + userId + " and plug " + plugId + " because it doesn't exist");
                return;
            }

            var ent = dbContext.NewUpcomingFromMyChannel.Remove(model);
            dbContext.SaveChanges();
            if (ent.State == EntityState.Deleted)
                Console.WriteLine("Removed NewUpcomingFromMyChannelModel for user " + userId + " and plug " + plugId);
            else
                Console.WriteLine("Unable to remove NewUpcomingFromMyChannelModel for user " + userId + " and plug " + plugId + " because it doesn't exist");

            int cnt = newUpcomingFromMyChannels.RemoveAll(newUpcomingFromMyChannel => newUpcomingFromMyChannel.userId == userId && newUpcomingFromMyChannel.plugId == plugId);
            if (cnt == 0)
                Console.WriteLine("Unable to remove listener on user " + model.userId + " channel to track new upcoming. (Requested by " + model.userId + " | " + model.plugId + ")");
            else
                Console.WriteLine("Removed listener on user " + model.userId + " channel to track new upcoming. (Requested by " + model.userId + " | " + model.plugId + ")");
        }

        public UserTubeFetcher? GetUserFetcher(int userId)
        {
            return userTubeFetchers.Find(userTubeFetcher => userTubeFetcher.GetAuth().userId == userId);
        }
    }
}
