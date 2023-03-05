using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace YouPlug.Models
{
    [Index(nameof(plugId), IsUnique = true)]
    [PrimaryKey(nameof(userId), nameof(plugId))]
    public class NewVideoFromMyChannelModel
    {
        [Key]
        public int userId { get; set; }
        [Key]
        public string plugId { get; set; }
        public long lastVideoDate { get; set; }
    }
}
