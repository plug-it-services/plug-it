using System.Text.Json;

namespace YouPlug.Dto
{
    public class OAuthResponseDto
    {
        public string access_token { get; set; }
        public uint expires_in { get; set; }
        public string? refresh_token { get; set; }
        public string scope { get; set; }
        public string token_type { get; set; }

        public static OAuthResponseDto? FromJson(string content)
        {
            return JsonSerializer.Deserialize<OAuthResponseDto>(content);
        }
    }
}
