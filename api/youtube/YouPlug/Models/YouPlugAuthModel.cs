using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace YouPlug.Models
{
    [Index(nameof(id), nameof(userId), IsUnique = true)]
    public class YouPlugAuthModel
    {
        public string id { get; set; }

        [Key]
        public uint userId { get; set; }

        public string redirectUrl { get; set; }

        public string? accessToken { get; set; }

        public long expiresAt { get; set; }

        public string? refreshToken { get; set; }

        public static YouPlugAuthModel? FromJson(string content)
        {
            return JsonSerializer.Deserialize<YouPlugAuthModel>(content);
        }
    }
}
