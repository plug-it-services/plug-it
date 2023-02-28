using System.Text;
using YouPlug.Dto;

namespace YouPlug.Services
{
    public class PlugRegistration
    {
        static PlugDataDto BuildPlugData()
        {
            PlugDataDto plugData = new PlugDataDto("youtube", PlugDataDto.PlugAuthType.oauth2, "/images/youtube_icon.png", "#FF0000");

            plugData.AddEvent( // OK
                "newVideoFromChannel",
                "New Video From Channel",
                "A new video has been published on Youtube from a specific channel",
                new List<PlugDataDto.PlugVariable>()
                {
                    new ("channelTitle", PlugDataDto.VariableType.String, "Channel Title", "The title of the channel that published the video"),
                    new ("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel that published the video"),
                    new ("videoTitle", PlugDataDto.VariableType.String, "Video Title", "The published video title"),
                    new ("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the published video"),
                    new ("videoDescription", PlugDataDto.VariableType.String, "Video Description", "The description of the published video"),
                },
                new List<PlugDataDto.PlugField>()
                {
                    new PlugDataDto.PlugField("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel to watch for new videos", true),
                }
            );

            plugData.AddEvent( // OK
                "newVideoFromMyChannel",
                "New Video From My Channel",
                "A new video has been published on your Youtube channel",
                new List<PlugDataDto.PlugVariable>()
                {
                    new ("channelTitle", PlugDataDto.VariableType.String, "Channel Title", "The title of the channel that published the video"),
                    new ("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel that published the video"),
                    new ("videoTitle", PlugDataDto.VariableType.String, "Video Title", "The published video title"),
                    new ("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the published video"),
                    new ("videoDescription", PlugDataDto.VariableType.String, "Video Description", "The description of the published video"),
                },
                new List<PlugDataDto.PlugField>() { }
            );

            plugData.AddEvent(
                "newStreamFromChannel",
                "New Stream From Channel",
                "A new stream has been published on Youtube from a specific channel",
                new List<PlugDataDto.PlugVariable>()
                {
                    new ("channelTitle", PlugDataDto.VariableType.String, "Channel Title", "The title of the channel that published the stream"),
                    new ("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel that published the stream"),
                    new ("videoTitle", PlugDataDto.VariableType.String, "Video Title", "The published stream title"),
                    new ("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the published stream"),
                    new ("videoDescription", PlugDataDto.VariableType.String, "Video Description", "The description of the published stream"),
                },
                new List<PlugDataDto.PlugField>()
                {
                    new PlugDataDto.PlugField("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel to watch for new streams", true),
                }
            );

            plugData.AddEvent(
                "newStreamFromMyChannel",
                "New Stream From My Channel",
                "A new stream has been published on your Youtube channel",
                new List<PlugDataDto.PlugVariable>()
                {
                    new ("channelTitle", PlugDataDto.VariableType.String, "Channel Title", "The title of the channel that published the stream"),
                    new ("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel that published the stream"),
                    new ("videoTitle", PlugDataDto.VariableType.String, "Video Title", "The published stream title"),
                    new ("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the published stream"),
                    new ("videoDescription", PlugDataDto.VariableType.String, "Video Description", "The description of the published stream"),
                },
                new List<PlugDataDto.PlugField>() { }
            );

            plugData.AddEvent(
                "newUpcomingFromChannel",
                "New Upcoming From Channel",
                "A new upcoming content has been published on Youtube from a specific channel",
                new List<PlugDataDto.PlugVariable>()
                {
                    new ("channelTitle", PlugDataDto.VariableType.String, "Channel Title", "The title of the channel that published the upcoming stream"),
                    new ("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel that published the upcoming stream"),
                    new ("videoTitle", PlugDataDto.VariableType.String, "Video Title", "The published upcoming stream title"),
                    new ("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the published upcoming stream"),
                    new ("videoDescription", PlugDataDto.VariableType.String, "Video Description", "The description of the published upcoming stream"),
                },
                new List<PlugDataDto.PlugField>()
                {
                    new PlugDataDto.PlugField("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel to watch for new upcoming streams", true),
                }
            );

            plugData.AddEvent(
                "newUpcomingFromMyChannel",
                "New Upcoming From My Channel",
                "A new upcoming content has been published on your Youtube channel",
                new List<PlugDataDto.PlugVariable>()
                {
                    new ("channelTitle", PlugDataDto.VariableType.String, "Channel Title", "The title of the channel that published the upcoming stream"),
                    new ("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel that published the upcoming stream"),
                    new ("videoTitle", PlugDataDto.VariableType.String, "Video Title", "The published upcoming stream title"),
                    new ("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the published upcoming stream"),
                    new ("videoDescription", PlugDataDto.VariableType.String, "Video Description", "The description of the published upcoming stream"),
                },
                new List<PlugDataDto.PlugField>() { }
            );

            plugData.AddAction(
                "getMyChannelId",
                "Get My Channel ID",
                "Get the ID of your Youtube channel",
                new List<PlugDataDto.PlugVariable>()
                {
                    new ("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of your channel"),
                },
                new List<PlugDataDto.PlugField>() { }
            );

            plugData.AddAction( // OK
                "likeVideo",
                "Like a Video",
                "Like a video on Youtube from it's ID",
                new List<PlugDataDto.PlugVariable>() { },
                new List<PlugDataDto.PlugField>()
                {
                    new ("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the video to like", true),
                }
            );

            plugData.AddAction(
                "dislikeVideo",
                "Dislike a Video",
                "Dislike a video on Youtube from it's ID",
                new List<PlugDataDto.PlugVariable>() { },
                new List<PlugDataDto.PlugField>()
                {
                    new ("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the video to dislike", true),
                }
            );

            plugData.AddAction(
                "removeReactionFromVideo",
                "Remove Reaction From Video",
                "Remove your reaction from a video on Youtube from it's ID",
                new List<PlugDataDto.PlugVariable>() { },
                new List<PlugDataDto.PlugField>()
                {
                    new ("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the video to remove your reaction from", true),
                }
            );

            plugData.AddAction( // OK
                "subscribeToChannel",
                "Subscribe to a Channel",
                "Subscribe to a channel on Youtube from it's ID",
                new List<PlugDataDto.PlugVariable>() {
                    new ("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel you subscribed to"),
                    new ("channelTitle", PlugDataDto.VariableType.String, "Channel Title", "The title of the channel you subscribed to"),
                    new ("channelDescription", PlugDataDto.VariableType.String, "Channel Description", "The description of the channel you subscribed to"),
                },
                new List<PlugDataDto.PlugField>()
                {
                    new ("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel to subscribe to", true),
                }
            );

            plugData.AddAction(
                "unsubscribeFromChannel",
                "Unsubscribe from a Channel",
                "Unsubscribe from a channel on Youtube from it's ID",
                new List<PlugDataDto.PlugVariable>() { },
                new List<PlugDataDto.PlugField>()
                {
                    new ("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel to unsubscribe from", true),
                }
            );

            plugData.AddAction(
                "addVideoToWatchLater",
                "Add a Video to Watch Later",
                "Add a video to your Watch Later playlist on Youtube from it's ID",
                new List<PlugDataDto.PlugVariable>() {
                    new ("title", PlugDataDto.VariableType.String, "Video Title", "The title of the video you added to your Watch Later playlist"),
                    new ("description", PlugDataDto.VariableType.String, "Video Description", "The description of the video you added to your Watch Later playlist"),
                    new ("playlistId", PlugDataDto.VariableType.String, "Playlist ID", "The ID of the playlist you added the video to"),
                    new ("ownerChannelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel that published the video"),
                    new ("ownerChannelTitle", PlugDataDto.VariableType.String, "Channel Title", "The title of the channel that published the video"),
                },
                new List<PlugDataDto.PlugField>()
                {
                    new ("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the video to add to your Watch Later playlist", true),
                }
            );

            plugData.AddAction(
                "removeVideoFromWatchLater",
                "Remove a Video from Watch Later",
                "Remove a video from your Watch Later playlist on Youtube from it's ID",
                new List<PlugDataDto.PlugVariable>() { },
                new List<PlugDataDto.PlugField>()
                {
                    new ("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the video to remove from your Watch Later playlist", true),
                }
            );

            plugData.AddAction( // OK
                "createPlaylist",
                "Create a Playlist",
                "Create a playlist on Youtube",
                new List<PlugDataDto.PlugVariable>() {
                    new ("title", PlugDataDto.VariableType.String, "Video Title", "The title of the video you added to your Watch Later playlist"),
                    new ("description", PlugDataDto.VariableType.String, "Video Description", "The description of the video you added to your Watch Later playlist"),
                    new ("playlistId", PlugDataDto.VariableType.String, "Playlist ID", "The ID of the playlist you added the video to"),
                    new ("ownerChannelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel that published the video"),
                    new ("ownerChannelTitle", PlugDataDto.VariableType.String, "Channel Title", "The title of the channel that published the video"),
                },
                new List<PlugDataDto.PlugField>()
                {
                    new ("playlistName", PlugDataDto.VariableType.String, "Playlist Title", "The title of the playlist to create", true),
                    new ("playlistDescription", PlugDataDto.VariableType.String, "Playlist Description", "The description of the playlist to create", true),
                }
            );

            plugData.AddAction(
                "deletePlaylist",
                "Delete a Playlist",
                "Delete a playlist on Youtube from it's ID",
                new List<PlugDataDto.PlugVariable>() { },
                new List<PlugDataDto.PlugField>()
                {
                    new ("playlistId", PlugDataDto.VariableType.String, "Playlist ID", "The ID of the playlist to delete", true),
                }
            );

            plugData.AddAction( // OK
                "addVideoToPlaylist",
                "Add a Video to a Playlist",
                "Add a video to a playlist on Youtube from it's ID",
                new List<PlugDataDto.PlugVariable>() {
                    new ("title", PlugDataDto.VariableType.String, "Video Title", "The title of the video you added to your Watch Later playlist"),
                    new ("description", PlugDataDto.VariableType.String, "Video Description", "The description of the video you added to your Watch Later playlist"),
                    new ("playlistId", PlugDataDto.VariableType.String, "Playlist ID", "The ID of the playlist you added the video to"),
                    new ("ownerChannelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel that published the video"),
                    new ("ownerChannelTitle", PlugDataDto.VariableType.String, "Channel Title", "The title of the channel that published the video"),
                },
                new List<PlugDataDto.PlugField>()
                {
                    new ("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the video to add to your Watch Later playlist", true),
                    new ("playlistId", PlugDataDto.VariableType.String, "Playlist ID", "The ID of the playlist to add the video to", true),
                }
            );

            plugData.AddAction(
                "removeVideoFromPlaylist",
                "Remove a Video from a Playlist",
                "Remove a video from a playlist on Youtube from it's ID",
                new List<PlugDataDto.PlugVariable>() { },
                new List<PlugDataDto.PlugField>()
                {
                    new ("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the video to remove from your Watch Later playlist", true),
                    new ("playlistId", PlugDataDto.VariableType.String, "Playlist ID", "The ID of the playlist to remove the video from", true),
                }
            );

            return plugData;
        }

        public static async Task<bool> RegisterPlug()
        {
            string plugDataJsonString = PlugDataDto.ToJson(BuildPlugData());

            try
            {
                var client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Post, "http://plugs:80/service/initialize");
                request.Content = new StringContent(plugDataJsonString, Encoding.UTF8, "application/json");
                var response = await client.SendAsync(request);
                if (response.StatusCode != System.Net.HttpStatusCode.Created)
                {
                    Console.WriteLine("An error occured while sending plug registration: " + response.StatusCode);
                }
                return response.StatusCode == System.Net.HttpStatusCode.Created;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine("An error occured while sending plug registration: " + ex.Message);
                return false;
            }
        }
    }
}
