using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YouPlug.Models
{
    [Index(nameof(apiKey), IsUnique = true)]
    public class UserModel
    {
        [Key]
        public uint id { get; set; }
        
        public string apiKey { get; set; }
    }
}