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

namespace YouPlug.Services
{
    
    public class TubeFetcher
    {
        public static string[] Scopes = new string[] { YouTubeService.Scope.YoutubeReadonly };
        
        private YouTubeService youtubeService;

        private List<ChannelDto> channels = new();
        private List<VideoDto> videos = new();


        public TubeFetcher(string accessToken, string refreshToken)
        {
            try
            {
                TokenResponse token = new TokenResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
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
                    ApplicationName = this.GetType().ToString(),
                    HttpClientInitializer = cred
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error (TubeFetcher) : " + ex.Message);
            }
            
            if (youtubeService == null)
                throw new Exception("YoutubeService is null");
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

        public List<VideoDto> GetVideos(string channelId)
        {
            List<VideoDto> videos = new();
            var request = youtubeService.Search.List("snippet");
            request.ChannelId = channelId;
            request.Order = SearchResource.ListRequest.OrderEnum.Date;
            request.MaxResults = 10; // No need to query a lot of videos

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
                        Thumbnail = searchResult.Snippet.Thumbnails.High.Url,
                        ChannelId = searchResult.Snippet.ChannelId,
                        ChannelTitle = searchResult.Snippet.ChannelTitle,
                        PublishedAt = searchResult.Snippet.PublishedAt ?? DateTime.MinValue
                    });
                }
            }

            return videos;
        }
    }
}
