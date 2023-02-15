using Microsoft.AspNetCore.Mvc;

namespace YouPlug.Controllers
{
    
    
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {

        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetUser")]
        public User Get()
        {
            return new User() { Id = System.Guid.NewGuid().ToString() };
        }

        [HttpPost(Name = "GetLoginOAuth2")]
        public string GetLoginOAuth2()
        {
            var oauth2Callback = "https://accounts.google.com/o/oauth2/v2/auth";
            return oauth2Callback;
        }
    }
}