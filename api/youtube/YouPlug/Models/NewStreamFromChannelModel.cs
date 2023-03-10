using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace YouPlug.Models
{
    [Index(nameof(plugId), IsUnique = true)]
    [PrimaryKey(nameof(userId), nameof(plugId))]
    public class NewStreamFromChannelModel
    {
        [Key]
        public int userId { get; set; }
        [Key]
        public string plugId { get; set; }
        public string channelId { get; set; }
        public long lastStreamDate { get; set; }
    }
}
