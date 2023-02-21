using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using YouPlug.Db;
using YouPlug.Dto;
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
        public ActionResult<OAuth2Redirect> OAuth2([FromHeader] string user, [FromBody] OAuthStart body)
        {
            Console.WriteLine("Received request from UserController.OAuth2");
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
                Console.WriteLine("Missing configuration! " + $"redirUri[{redirUri}], clientId[{clientId}]");

                GeneralDto.ErrorMessage errorMessage = new() {
                    message = "Internal server error occurred: Missing configuration!"
                };
                return StatusCode(400, errorMessage);
            }

            Guid guid = Guid.NewGuid();

            var plugAuthModel = _plugDbContext.Auths.Find(userModel.id);
            if (plugAuthModel != null)
            {
                Console.WriteLine($"Found existing auth for user {userModel.id} with guid {plugAuthModel.id}. Updating with new guid...");
                Console.WriteLine($"Found existing auth for user {userModel.id} with guid {plugAuthModel.id}. Updating with new guid...");
                plugAuthModel.id = guid.ToString();
            }
            else
            {
                Console.WriteLine($"No existing auth for user {userModel.id}. Creating...");
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
            oauth2Callback += "&scope=https://www.googleapis.com/auth/youtube.readonly";
            oauth2Callback += "&access_type=offline";
            oauth2Callback += "&state=" + guid.ToString();

            Console.WriteLine("Generated callback: " + oauth2Callback);
            Console.WriteLine("Generated callback: " + oauth2Callback);

            OAuth2Redirect oAuth2Redirect = new() { url = oauth2Callback };
            return oAuth2Redirect;
        }

        [HttpGet("callback", Name = "OAuth2Callback")]
        public async Task<ActionResult> Callback([FromQuery] string? error, [FromQuery] string code, [FromQuery] string state)
        {
            Console.WriteLine("Received request from UserController.Callback");
            Console.WriteLine("Received request from UserController.Callback");
            if (!string.IsNullOrWhiteSpace(error))
            {
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: " + error
                };
                Console.WriteLine("Error from UserController.Callback: " + error);
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
                Console.WriteLine("Error from UserController.Callback: Missing code!");
                return StatusCode(400, errorMessage);
            }

            YouPlugAuthModel? auth;
            try
            {
                auth = _plugDbContext.Auths.Where(a => a.id == state).First();
            }
            catch (Exception e)
            {
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: " + e.Message
                };
                Console.WriteLine("Error during DB research UserController.Callback: " + e.Message);
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
                Console.WriteLine("Error from UserController.Callback: Missing/missmatch auth!");
                return StatusCode(400, errorMessage);
            }

            var response = await TokenService.ExchangeAuthCode(_config, state, code);

            if (response == null || string.IsNullOrWhiteSpace(response.refresh_token))
            {
                GeneralDto.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing response or refresh token!"
                };
                Console.WriteLine("Error from UserController.Callback: Missing response or refresh token!");
                Console.WriteLine("Error from UserController.Callback: Missing response or refresh token!");
                return StatusCode(400, errorMessage);
            }

            auth.accessToken = response.access_token;
            auth.expiresAt = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds() + response.expires_in;
            auth.refreshToken = response.refresh_token;
            _plugDbContext.SaveChanges();

            Console.WriteLine("Successfully updated auth for user " + auth.userId + $"redirecting to {auth.redirectUrl}");
            Console.WriteLine("Successfully updated auth for user " + auth.userId + $"redirecting to {auth.redirectUrl}");
            return Redirect(auth.redirectUrl);
        }

        [HttpPost("disconnect", Name = "Disconnect")]
        public ActionResult Disconnect([FromHeader] string user)
        {
            GeneralDto.ErrorMessage msg = new() { message = "Successfully disconnected!" };
            return StatusCode(200, msg);
        }
    }
}