using YouPlug.Models;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Google.Apis.Services;
using Microsoft.EntityFrameworkCore;
using YouPlug.Dto.Youtube;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Util.Store;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using static YouPlug.Dto.Rabbit.RabbitDto;

namespace YouPlug.Services
{
    
    public class UserTubeFetcher
    {
        public static string[] Scopes = new string[] {
            YouTubeService.Scope.YoutubeReadonly,
            YouTubeService.Scope.Youtube
        };
        
        private YouTubeService youtubeService;
        
        private YouPlugAuthModel authModel;


        public UserTubeFetcher(YouPlugAuthModel model)
        {
            authModel = model;
            try
            {
                TokenResponse token = new TokenResponse
                {
                    AccessToken = model.accessToken,
                    RefreshToken = model.refreshToken
                };

                var cred = new UserCredential
                    (new GoogleAuthorizationCodeFlow(
                        new GoogleAuthorizationCodeFlow.Initializer()
                        {
                            ClientSecrets = new ClientSecrets()
                            {
                                ClientId = Environment.GetEnvironmentVariable("CLIENT_ID"),
                                ClientSecret = Environment.GetEnvironmentVariable("CLIENT_SECRET")
                            }
                        }
                        ),
                        "user",
                        token
                    );

                youtubeService = new YouTubeService(new BaseClientService.Initializer()
                {
                    ApplicationName = "PlugIt",
                    HttpClientInitializer = cred
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error (TubeFetcher) : " + ex.Message);
                Console.WriteLine("Error (TubeFetcher) : " + ex.Message);
            }
            
            if (youtubeService == null)
                throw new Exception("YoutubeService is null");
        }

        public YouPlugAuthModel GetAuth()
        {
            return authModel;
        }
        

        public List<ChannelDto> GetSubscriptions()
        {
            List<ChannelDto> channels = new();
            var request = youtubeService.Subscriptions.List("snippet");
            request.Mine = true;

            var response = request.Execute();
            var subscriptions = response.Items;

            foreach (var subscription in subscriptions)
            {
                channels.Add(new ChannelDto
                {
                    Id = subscription.Snippet.ResourceId.ChannelId,
                    Title = subscription.Snippet.Title,
                    Description = subscription.Snippet.Description,
                    Thumbnail = subscription.Snippet.Thumbnails.High.Url
                });
            }

            return channels;
        }

        public string GetMyOwnChannelId()
        {
            var request = youtubeService.Channels.List("snippet");
            request.Mine = true;
            var response = request.Execute();

            return response.Items[0].Id;
        }

        public List<VideoDto> GetVideos(string? channelId, int maxResults)
        {
            List<VideoDto> videos = new();
            var request = youtubeService.Search.List("snippet");
            if (string.IsNullOrEmpty(channelId))
                request.ChannelId = GetMyOwnChannelId();
            else
                request.ChannelId = channelId;
            request.Order = SearchResource.ListRequest.OrderEnum.Date;
            request.Type = "video";
            request.MaxResults = maxResults;

            var response = request.Execute();
            var searchResults = response.Items;

            foreach (var searchResult in searchResults)
            {
                if (searchResult.Id.Kind == "youtube#video")
                {
                    videos.Add(new VideoDto
                    {
                        Id = searchResult.Id.VideoId,
                        Title = searchResult.Snippet.Title,
                        Description = searchResult.Snippet.Description,
                        Thumbnail = searchResult.Snippet.Thumbnails?.Standard?.Url,
                        ChannelId = searchResult.Snippet.ChannelId,
                        ChannelTitle = searchResult.Snippet.ChannelTitle,
                        PublishedAt = searchResult.Snippet.PublishedAt ?? DateTime.MinValue
                    });
                }
            }

            return videos;
        }

        
        public void PublishComment(string videoId, string comment)
        {
            var request = youtubeService.CommentThreads.Insert(new CommentThread
            {
                Snippet = new CommentThreadSnippet
                {
                    VideoId = videoId,
                    TopLevelComment = new Comment
                    {
                        Snippet = new CommentSnippet
                        {
                            TextOriginal = comment
                        }
                    }
                }
            }, "snippet");

            request.Execute();
        }

        
        public void DeleteComment(string commentId)
        {
            var request = youtubeService.Comments.Delete(commentId);
            request.Execute();
        }

        
        public void PublishReply(string videoId, string commentId, string reply)
        {
            var request = youtubeService.Comments.Insert(new Comment
            {
                Snippet = new CommentSnippet
                {
                    VideoId = videoId,
                    ParentId = commentId,
                    TextOriginal = reply
                }
            }, "snippet");

            request.Execute();
        }

        
        public Variable[] LikeVideo(string videoId)
        {
            var request = youtubeService.Videos.Rate(videoId, VideosResource.RateRequest.RatingEnum.Like);
            request.Execute();
            return new Variable[] {};
        }

        
        public void DislikeVideo(string videoId)
        {
            var request = youtubeService.Videos.Rate(videoId, VideosResource.RateRequest.RatingEnum.Dislike);
            request.Execute();
        }

        public void RemoveReactionToVideo(string videoId)
        {
            var request = youtubeService.Videos.Rate(videoId, VideosResource.RateRequest.RatingEnum.None);
            request.Execute();
        }


        public void SubscribeToChannel(string channelId)
        {
            var request = youtubeService.Subscriptions.Insert(new Subscription
            {
                Snippet = new SubscriptionSnippet
                {
                    ResourceId = new ResourceId
                    {
                        Kind = "youtube#channel",
                        ChannelId = channelId
                    }
                }
            }, "snippet");

            request.Execute();
        }

        
        public void UnsubscribeFromChannel(string channelId)
        {
            var request = youtubeService.Subscriptions.Delete(channelId);
            request.Execute();
        }
        
        
        public void AddToWatchLater(string videoId)
        {
            var request = youtubeService.PlaylistItems.Insert(new PlaylistItem
            {
                Snippet = new PlaylistItemSnippet
                {
                    PlaylistId = "WL",
                    ResourceId = new ResourceId
                    {
                        Kind = "youtube#video",
                        VideoId = videoId
                    }
                }
            }, "snippet");

            request.Execute();
        }

        
        public void RemoveFromWatchLater(string videoId)
        {
            var request = youtubeService.PlaylistItems.List("snippet");
            request.PlaylistId = "WL";
            request.MaxResults = 50;

            var response = request.Execute();
            var playlistItems = response.Items;

            foreach (var playlistItem in playlistItems)
            {
                if (playlistItem.Snippet.ResourceId.VideoId == videoId)
                {
                    var deleteRequest = youtubeService.PlaylistItems.Delete(playlistItem.Id);
                    deleteRequest.Execute();
                    break;
                }
            }
        }

        
        public void CreatePlaylist(string title, string description)
        {
            var request = youtubeService.Playlists.Insert(new Playlist
            {
                Snippet = new PlaylistSnippet
                {
                    Title = title,
                    Description = description
                }
            }, "snippet");

            request.Execute();
        }

        
        public void RemovePlaylist(string playlistId)
        {
            var request = youtubeService.Playlists.Delete(playlistId);
            request.Execute();
        }

        
        public void AddToPlaylist(string playlistId, string videoId)
        {
            var request = youtubeService.PlaylistItems.Insert(new PlaylistItem
            {
                Snippet = new PlaylistItemSnippet
                {
                    PlaylistId = playlistId,
                    ResourceId = new ResourceId
                    {
                        Kind = "youtube#video",
                        VideoId = videoId
                    }
                }
            }, "snippet");

            request.Execute();
        }

        
        public void RemoveFromPlaylist(string playlistId, string videoId)
        {
            var request = youtubeService.PlaylistItems.List("snippet");
            request.PlaylistId = playlistId;
            request.MaxResults = 50;

            var response = request.Execute();
            var playlistItems = response.Items;

            foreach (var playlistItem in playlistItems)
            {
                if (playlistItem.Snippet.ResourceId.VideoId == videoId)
                {
                    var deleteRequest = youtubeService.PlaylistItems.Delete(playlistItem.Id);
                    deleteRequest.Execute();
                    break;
                }
            }
        }
    }
}
