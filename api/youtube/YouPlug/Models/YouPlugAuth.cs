using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace YouPlug.Models
{
    [Index(nameof(id), nameof(userId), nameof(accessToken), IsUnique = true)]
    public class YouPlugAuth
    {
        [Key]
        public string id { get; set; }

        public uint userId { get; set; }

        public string redirectUrl { get; set; }

        public string accessToken { get; set; }

        public long expiresAt { get; set; }

        public string refreshToken { get; set; }

        public static YouPlugAuth? FromJson(string content)
        {
            return JsonSerializer.Deserialize<YouPlugAuth>(content);
        }
    }
}
