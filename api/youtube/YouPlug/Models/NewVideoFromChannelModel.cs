using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace YouPlug.Models
{
    [Index(nameof(plugId), IsUnique = true)]
    public class NewVideoFromChannelModel
    {
        public string userId { get; set; }
        [Key]
        public string plugId { get; set; }
        public string channelId { get; set; }
    }
}
