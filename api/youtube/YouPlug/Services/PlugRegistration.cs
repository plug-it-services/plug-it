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
                "newVideoFromChannel",
                "New Video From Channel",
                "A new video has been published on Youtube from a specific channel",
                new List<PlugDataDto.PlugVariable>()
                {
                    new PlugDataDto.PlugVariable("videoTitle", PlugDataDto.VariableType.String, "Video Title", "The published video title"),
                    new PlugDataDto.PlugVariable("channelTitle", PlugDataDto.VariableType.String, "Channel Title", "The title of the channel that published the video"),
                },
                new List<PlugDataDto.PlugField>()
                {
                    new PlugDataDto.PlugField("channelId", PlugDataDto.VariableType.String, "Channel ID", "The ID of the channel to watch for new videos", true),
                }
            );

            plugData.AddEvent(
                "newVideoFromMyChannel",
                "New Video From My Channel",
                "A new video has been published on your Youtube channel",
                new List<PlugDataDto.PlugVariable>()
                {
                    new PlugDataDto.PlugVariable("videoTitle", PlugDataDto.VariableType.String, "Video Title", "The published video title"),
                    new PlugDataDto.PlugVariable("channelTitle", PlugDataDto.VariableType.String, "Channel Title", "The title of the channel that published the video"),
                },
                new List<PlugDataDto.PlugField>() { }
            );

            plugData.AddAction(
                "likeVideo",
                "Like a Video",
                "Like a video on Youtube from it's ID",
                new List<PlugDataDto.PlugVariable>() {},
                new List<PlugDataDto.PlugField>()
                {
                    new PlugDataDto.PlugField("videoId", PlugDataDto.VariableType.String, "Video ID", "The ID of the video to like", true),
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
