using Google.Apis.YouTube.v3;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using YouPlug.Db;
using YouPlug.Dto;
using YouPlug.Models;
using YouPlug.Services;

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

        public class PlugAuthUser
        {
            [JsonPropertyName("userId")] public uint UserId { get; set; }

            public string ToJson()
            {
                return JsonSerializer.Serialize(this);
            }
        }

        public UserController(ILogger<UserController> logger, IConfiguration config, PlugDbContext plugDbContext)
        {
            _logger = logger;
            _config = config;
            _plugDbContext = plugDbContext;
            Console.WriteLine("UserController created");
        }

        [HttpPost("oauth2", Name = "OAuth2")]
        public ActionResult<OAuth2Redirect> OAuth2([FromHeader] string user, [FromBody] OAuthStart body)
        {
            Console.WriteLine("Received request from UserController.OAuth2");
            string? redirUri = Environment.GetEnvironmentVariable("OAUTH2_CALLBACK", EnvironmentVariableTarget.Process);
            string? clientId = Environment.GetEnvironmentVariable("CLIENT_ID", EnvironmentVariableTarget.Process);

            UserModel? userModel = UserModel.FromJson(user);

            if (userModel == null)
            {
                Console.WriteLine("Missing user data!");
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing user data!"
                };
                return StatusCode(400, errorMessage);
            }

            if (string.IsNullOrWhiteSpace(redirUri) || string.IsNullOrWhiteSpace(clientId))
            {
                Console.WriteLine("Missing configuration! " + $"redirUri[{redirUri}], clientId[{clientId}]");

                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing configuration!"
                };
                return StatusCode(400, errorMessage);
            }

            Guid guid = Guid.NewGuid();

            var plugAuthModel = _plugDbContext.Auths.Find(userModel.id);
            if (plugAuthModel != null)
            {
                Console.WriteLine($"Found existing auth for user {userModel.id} with guid {plugAuthModel.id}. Updating with new guid...");
                plugAuthModel.id = guid.ToString();
                plugAuthModel.redirectUrl = body.redirectUrl;
            }
            else
            {
                Console.WriteLine($"No existing auth for user {userModel.id}. Creating...");
                _plugDbContext.Auths.Add(new YouPlugAuthModel()
                {
                    id = guid.ToString(),
                    userId = userModel.id,
                    redirectUrl = body.redirectUrl
                });
            }
            _plugDbContext.SaveChanges();

            var oauth2Callback = "https://accounts.google.com/o/oauth2/v2/auth";
            oauth2Callback += "?client_id=" + clientId;
            oauth2Callback += "&redirect_uri=" + redirUri;
            oauth2Callback += "&response_type=code";
            // YouTubeService.Scope.YoutubeReadonly + YouTubeService.Scope.Youtube
            oauth2Callback += "&scope=" + YouTubeService.Scope.YoutubeReadonly + " " + YouTubeService.Scope.Youtube + " " + YouTubeService.Scope.YoutubeForceSsl;
            oauth2Callback += "&access_type=offline";
            // oauth2Callback += "&approval_prompt=force";
            // oauth2Callback += "&include_granted_scopes=true";
            oauth2Callback += "&state=" + guid.ToString();
            oauth2Callback += "&prompt=consent";

            Console.WriteLine("Generated callback: " + oauth2Callback);

            OAuth2Redirect oAuth2Redirect = new() { url = oauth2Callback };
            return oAuth2Redirect;
        }

        [HttpGet("callback", Name = "OAuth2Callback")]
        public async Task<ActionResult> Callback([FromQuery] string? error, [FromQuery] string code, [FromQuery] string state)
        {
            Console.WriteLine("Received request from UserController.Callback");
            if (!string.IsNullOrWhiteSpace(error))
            {
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: " + error
                };
                Console.WriteLine("Error from UserController.Callback: " + error);
                return StatusCode(400, errorMessage);
            }

            if (string.IsNullOrWhiteSpace(code))
            {
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing code!"
                };
                Console.WriteLine("Error from UserController.Callback: Missing code!");
                return StatusCode(400, errorMessage);
            }

            if (string.IsNullOrWhiteSpace(state))
            {
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing state!"
                };
                Console.WriteLine("Error from UserController.Callback: Missing state!");
                return StatusCode(400, errorMessage);
            }

            YouPlugAuthModel? auth;
            try
            {
                auth = _plugDbContext.Auths.First(a => a.id == state);
            }
            catch (Exception e)
            {
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: " + e.Message
                };
                Console.WriteLine("Error during DB research UserController.Callback: " + e.Message);
                return StatusCode(500, errorMessage);
            }

            if (auth == null)
            {
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing/missmatch auth!"
                };
                Console.WriteLine("Error from UserController.Callback: Missing/missmatch auth!");
                return StatusCode(400, errorMessage);
            }

            var response = await TokenService.ExchangeAuthCode(state, code);

            if (response == null || string.IsNullOrWhiteSpace(response.access_token) || string.IsNullOrWhiteSpace(response.refresh_token))
            {
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing response or missing tokens!"
                };
                Console.WriteLine("Error from UserController.Callback: Missing response or missing tokens!");
                return StatusCode(400, errorMessage);
            }

            auth.accessToken = response.access_token;
            auth.expiresAt = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds() + response.expires_in;
            auth.refreshToken = response.refresh_token;
            _plugDbContext.SaveChanges();

            // Sending to plug that auth was successful
            PlugAuthUser plugAuthUser = new() { UserId = auth.userId };
            string? plugAuthUserUrl = Environment.GetEnvironmentVariable("PLUGS_SERVICE_LOGGED_IN_URL", EnvironmentVariableTarget.Process);

            if (string.IsNullOrWhiteSpace(plugAuthUserUrl))
            {
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing PLUGS_SERVICE_LOGGED_IN_URL env var!"
                };
                Console.WriteLine("Error from UserController.Callback: Missing PLUGS_SERVICE_LOGGED_IN_URL env var!");
                return StatusCode(500, errorMessage);
            }

            try
            {
                var client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Post, plugAuthUserUrl);
                request.Content = new StringContent(plugAuthUser.ToJson(), Encoding.UTF8, "application/json");
                var responsePlugLog = await client.SendAsync(request);
                if (responsePlugLog.StatusCode != System.Net.HttpStatusCode.Created)
                    throw new HttpRequestException("Plug login notify failed, the returned status code don't match");

            }
            catch (HttpRequestException ex)
            {
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Error during plug login notify"
                };
                Console.WriteLine("An error occured while sending plug registration: " + ex.Message);
                return StatusCode(500, errorMessage);
            }

            Console.WriteLine("Successfully updated auth for user " + auth.userId + $"redirecting to {auth.redirectUrl}");

            Program.fetcherService.AddUser(auth);

            return Redirect(auth.redirectUrl);
        }

        [HttpPost("disconnect", Name = "Disconnect")]
        public async Task<ActionResult> Disconnect([FromHeader] string user)
        {
            Console.WriteLine("Received request from UserController.Disconnect" + $"user: {user}");
            UserModel? userModel = UserModel.FromJson(user);

            if (userModel == null)
            {
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing user!"
                };
                Console.WriteLine("Error from UserController.Disconnect: Missing user!");
                return StatusCode(400, errorMessage);
            }

            PlugAuthUser plugAuthUser = new() { UserId = userModel.id };
            string? plugAuthUserUrl = Environment.GetEnvironmentVariable("PLUGS_SERVICE_LOGGED_OUT_URL", EnvironmentVariableTarget.Process);

            if (string.IsNullOrWhiteSpace(plugAuthUserUrl))
            {
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing PLUGS_SERVICE_LOGGED_IN_URL env var!"
                };
                Console.WriteLine("Error from UserController.Callback: Missing PLUGS_SERVICE_LOGGED_IN_URL env var!");
                return StatusCode(500, errorMessage);
            }

            Program.fetcherService.RemoveUser(userModel.id, true);

            try
            {
                var client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Post, plugAuthUserUrl);
                request.Content = new StringContent(plugAuthUser.ToJson(), Encoding.UTF8, "application/json");
                var responsePlugLog = await client.SendAsync(request);
                if (responsePlugLog.StatusCode != System.Net.HttpStatusCode.Created)
                    throw new HttpRequestException("Plug login notify failed, the returned status code don't match");

            }
            catch (HttpRequestException ex)
            {
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Error during plug login notify"
                };
                Console.WriteLine("An error occured while sending plug registration: " + ex.Message);
                return StatusCode(500, errorMessage);
            }

            return Ok();
        }
    }
}