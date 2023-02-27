using System.Text;
using YouPlug.Dto;

namespace YouPlug.Services
{
    public class PlugRegistration
    {
        static PlugDataDto BuildPlugData()
        {
            PlugDataDto plugData = new PlugDataDto("youtube", PlugDataDto.PlugAuthType.oauth2, "/images/youtube_icon.png", "#FF0000");
            plugData.AddEvent(
                "videoPublished",
                "Video Published",
                "A video has been published on Youtube",
                new List<PlugDataDto.PlugVariable>()
                {
            new PlugDataDto.PlugVariable("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the video published"),
            new PlugDataDto.PlugVariable("videoTitle", PlugDataDto.VariableType.String, "Video Title", "The published video title"),
            new PlugDataDto.PlugVariable("videoDescription", PlugDataDto.VariableType.String, "Video Description", "The published video description"),
            new PlugDataDto.PlugVariable("videoThumbnail", PlugDataDto.VariableType.String, "Video Thumbnail", "The published video thumbnail"),
            new PlugDataDto.PlugVariable("videoPublishedAt", PlugDataDto.VariableType.String, "Video Published At", "The date of the published video"),
            new PlugDataDto.PlugVariable("videoChannelId", PlugDataDto.VariableType.String, "Video Channel ID", "The ID of the channel that published the video"),
            new PlugDataDto.PlugVariable("videoChannelTitle", PlugDataDto.VariableType.String, "Video Channel Title", "The title of the channel that published the video"),
            new PlugDataDto.PlugVariable("videoChannelThumbnail", PlugDataDto.VariableType.String, "Video Channel Thumbnail", "The thumbnail of the channel that published the video"),
                },
                new List<PlugDataDto.PlugField>()
            );
            plugData.AddEvent(
                "newVideoFromChannel",
                "New Video From Channel",
                "A new video has been published on Youtube from a specific channel",
                new List<PlugDataDto.PlugVariable>()
                {
                    new PlugDataDto.PlugVariable("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the video published"),
                    new PlugDataDto.PlugVariable("videoTitle", PlugDataDto.VariableType.String, "Video Title", "The published video title"),
                    new PlugDataDto.PlugVariable("videoDescription", PlugDataDto.VariableType.String, "Video Description", "The published video description"),
                    new PlugDataDto.PlugVariable("videoThumbnail", PlugDataDto.VariableType.String, "Video Thumbnail", "The published video thumbnail"),
                    new PlugDataDto.PlugVariable("videoPublishedAt", PlugDataDto.VariableType.String, "Video Published At", "The date of the published video"),
                    new PlugDataDto.PlugVariable("videoChannelId", PlugDataDto.VariableType.String, "Video Channel ID", "The ID of the channel that published the video"),
                    new PlugDataDto.PlugVariable("videoChannelTitle", PlugDataDto.VariableType.String, "Video Channel Title", "The title of the channel that published the video"),
                    new PlugDataDto.PlugVariable("videoChannelThumbnail", PlugDataDto.VariableType.String, "Video Channel Thumbnail", "The thumbnail of the channel that published the video"),
                },
                new List<PlugDataDto.PlugField>()
                {
                    new PlugDataDto.PlugField("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel to watch for new videos", true),
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
