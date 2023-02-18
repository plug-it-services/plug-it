using System.Text.Json;

namespace YouPlug.Models
{
    public class UserModel
    {
        public uint id { get; set; }
        public string email { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }

        public static UserModel? FromJson(string content)
        {
            return JsonSerializer.Deserialize<UserModel>(content);
        }
    }
}
