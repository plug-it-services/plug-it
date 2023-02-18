using Microsoft.AspNetCore.Mvc;
using System.Text;
using YouPlug.Models;
using YouPlug.Services;
using static System.Net.WebRequestMethods;

namespace YouPlug.Controllers
{

    [ApiController]
    [Route("public")]
    public class UserController : ControllerBase
    {

        private readonly ILogger<UserController> _logger;
        private readonly IConfiguration _config;
        private readonly PlugDbContext _plugDbContext;
        public class OAuth2Redirect
        {
            public string url { get; set; }
        }

        public UserController(ILogger<UserController> logger, IConfiguration config, PlugDbContext plugDbContext)
        {
            _logger = logger;
            _config = config;
            _plugDbContext = plugDbContext;
        }

        [HttpPost("oauth2", Name = "OAuth2")]
        public ActionResult<OAuth2Redirect> OAuth2([FromHeader] string user, [FromBody] OAuth2Start body)
        {
            string redirUri = _config.GetValue<string>("OAUTH2_CALLBACK");
            string clientId = _config.GetValue<string>("CLIENT_ID");

            UserModel? userModel = UserModel.FromJson(user);

            if (userModel == null)
            {
                GeneralModels.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing user data!"
                };
                return StatusCode(400, errorMessage);
            }

            if (string.IsNullOrWhiteSpace(redirUri) || string.IsNullOrWhiteSpace(clientId))
            {
                GeneralModels.ErrorMessage errorMessage = new() {
                    message = "Internal server error occurred: Missing configuration!"
                };
                return StatusCode(400, errorMessage);
            }

            Guid guid = Guid.NewGuid();

            if (_plugDbContext.Auths.Find(guid.ToString()) != null)
            {
                _plugDbContext.Auths.Update(new YouPlugAuth()
                {
                    id = guid.ToString(),
                    userId = userModel.id,
                    redirectUrl = body.redirectUrl,
                    accessToken = ""
                });
            }
            else
            {
                _plugDbContext.Auths.Add(new YouPlugAuth()
                {
                    id = guid.ToString(),
                    userId = userModel.id,
                    redirectUrl = body.redirectUrl,
                    accessToken = ""
                });
            }

            var oauth2Callback = "https://accounts.google.com/o/oauth2/v2/auth";
            oauth2Callback += "?client_id=" + clientId;
            oauth2Callback += "&redirect_uri=" + redirUri;
            oauth2Callback += "&response_type=code";
            oauth2Callback += "&scope=https://www.googleapis.com/auth/youtube.readonly";
            oauth2Callback += "&access_type=offline";
            oauth2Callback += "&state=" + guid.ToString();

            OAuth2Redirect oAuth2Redirect = new() { url = oauth2Callback };
            return oAuth2Redirect;
        }

        [HttpGet("callback", Name = "OAuth2Callback")]
        public async Task<ActionResult> Callback([FromQuery] string error, [FromQuery] string code, [FromQuery] string state)
        {
            if (!string.IsNullOrWhiteSpace(error))
            {
                GeneralModels.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: " + error
                };
                return StatusCode(400, errorMessage);
            }

            if (string.IsNullOrWhiteSpace(code))
            {
                GeneralModels.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing code!"
                };
                return StatusCode(400, errorMessage);
            }

            YouPlugAuth? auth = _plugDbContext.Auths.Find(state);

            if (auth == null)
            {
                GeneralModels.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing/missmatch auth!"
                };
                return StatusCode(400, errorMessage);
            }

            var response = await TokenService.ExchangeAuthCode(_config, state, code);

            var updatedPlugAuth = _plugDbContext.Auths.Update(new YouPlugAuth()
            {
                id = state,
                accessToken = response.access_token,
                expiresAt = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds() + response.expires_in,
                refreshToken = response.refresh_token
            });

            return Redirect(updatedPlugAuth.Entity.redirectUrl);
        }

        [HttpPost("disconnect", Name = "Disconnect")]
        public ActionResult Disconnect([FromHeader] string user)
        {
            GeneralModels.ErrorMessage msg = new() { message = "Successfully disconnected!" };
            return StatusCode(200, msg);
        }
    }
}