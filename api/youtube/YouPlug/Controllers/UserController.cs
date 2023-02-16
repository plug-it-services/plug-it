using Microsoft.AspNetCore.Mvc;
using Sprache;
using YouPlug.Models;

namespace YouPlug.Controllers
{

    [ApiController]
    [Route("public")]
    public class UserController : ControllerBase
    {

        private readonly ILogger<UserController> _logger;
        private readonly IConfiguration _config;
        private readonly PlugDbContext _plugDbContext;

        public UserController(ILogger<UserController> logger, IConfiguration config, PlugDbContext plugDbContext)
        {
            _logger = logger;
            _config = config;
            _plugDbContext = plugDbContext;
        }

        [HttpPost("oauth2", Name = "OAuth2")]
        public ActionResult<OAuth2Redirect> OAuth2()
        {
            string baseUrl = _config.GetValue<string>("OAUTH2_CALLBACK");
            string clientId = _config.GetValue<string>("CLIENT_ID");

            if (string.IsNullOrWhiteSpace(baseUrl) || string.IsNullOrWhiteSpace(clientId))
            {
                GeneralModels.ErrorMessage errorMessage = new() {
                    message = "Internal server error occurred: Missing configuration!"
                };
                return StatusCode(500, errorMessage);
            }

            Guid guid = Guid.NewGuid();

            var oauth2Callback = baseUrl;
            oauth2Callback += "?client_id=" + clientId;
            oauth2Callback += "&redirect_uri=http://plugs/service/youtube/callback";
            oauth2Callback += "&response_type=code";
            oauth2Callback += "&scope=https://www.googleapis.com/auth/youtube.readonly";
            oauth2Callback += "&access_type=offline";
            oauth2Callback += "&state=" + guid.ToString();

            // Check if db connection is working
            if (_plugDbContext.Database.CanConnect())
            {
                _logger.LogInformation("Database connection is working!");
            }
            else
            {
                _logger.LogError("Database connection is not working!");
            }
            

            OAuth2Redirect oAuth2Redirect = new() { url = oauth2Callback };
            return oAuth2Redirect;
        }
    }
}