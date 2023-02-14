using PlugSharp;
using System.Text;

static PlugData BuildPlugData()
{
    PlugData plugData = new PlugData("Youtube", PlugData.PlugAuthType.None, "/images/youtube_icon.png", "#FF0000");
    plugData.AddEvent(
        "videoPublished",
        "Video Published",
        "A video has been published on Youtube",
        new List<PlugData.PlugVariable>()
        {
            new PlugData.PlugVariable("videoId", PlugData.VariableType.String, "Video ID", "The ID of the video published"),
            new PlugData.PlugVariable("videoTitle", PlugData.VariableType.String, "Video Title", "The published video title"),
            new PlugData.PlugVariable("videoDescription", PlugData.VariableType.String, "Video Description", "The published video description"),
            new PlugData.PlugVariable("videoThumbnail", PlugData.VariableType.String, "Video Thumbnail", "The published video thumbnail"),
            new PlugData.PlugVariable("videoPublishedAt", PlugData.VariableType.String, "Video Published At", "The date of the published video"),
            new PlugData.PlugVariable("videoChannelId", PlugData.VariableType.String, "Video Channel ID", "The ID of the channel that published the video"),
            new PlugData.PlugVariable("videoChannelTitle", PlugData.VariableType.String, "Video Channel Title", "The title of the channel that published the video"),
            new PlugData.PlugVariable("videoChannelThumbnail", PlugData.VariableType.String, "Video Channel Thumbnail", "The thumbnail of the channel that published the video"),
        },
        new List<PlugData.PlugField>()
    );
    return plugData;
}

static async Task<bool> RegisterPlug()
{
    string plugDataJsonString = PlugData.ToJson(BuildPlugData());

    try {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, "http://plugs:80/service/initialize");
        request.Content = new StringContent(plugDataJsonString, Encoding.UTF8, "application/json");
        var response = await client.SendAsync(request);
        return response.StatusCode == System.Net.HttpStatusCode.Created;
    } catch (HttpRequestException ex) {
        Console.WriteLine("An error occured while sending plug registration: " + ex.Message);
        return false;
    }
}

bool plugRegistration = await RegisterPlug();

if (!plugRegistration)
{
    Console.WriteLine("Unable to register plug!");
    return;
}
Console.WriteLine("Plug should be registered!");
