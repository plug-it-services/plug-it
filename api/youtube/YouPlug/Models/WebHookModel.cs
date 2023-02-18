using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace YouPlug.Models
{
    [Index(nameof(plugId), nameof(eventId))]
    [Index(nameof(userId), IsUnique = true)]
    public class WebHookModel
    {
        [Key]
        public Guid uuid { get; set; }

        public uint userId { get; set; }

        public string plugId { get; set; }

        public string eventId { get; set; }

        public string? webhookId { get; set; }
    }
}
