using Microsoft.EntityFrameworkCore;
using YouPlug.Models;

namespace YouPlug.Services
{
    public class TokenService
    {

        public static async Task<OAuthResponse?> ExchangeAuthCode(IConfiguration config, string state, string code)
        {
            string googleTokenUrl = "https://oauth2.googleapis.com/token";
            googleTokenUrl += "?client_id=" + config.GetValue<string>("CLIENT_ID");
            googleTokenUrl += "&client_secret=" + config.GetValue<string>("CLIENT_SECRET");
            googleTokenUrl += "&redirect_uri=" + config.GetValue<string>("OAUTH2_CALLBACK");
            googleTokenUrl += "&grant_type=authorization_code";
            googleTokenUrl += "&code=" + code;

            HttpResponseMessage response;
            try
            {
                var client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Post, googleTokenUrl);
                response = await client.SendAsync(request);

                if (response == null)
                {
                    GeneralModels.ErrorMessage errorMessage = new()
                    {
                        message = "Internal server error occurred: Missing response!"
                    };
                    return null;
                }
            }
            catch (HttpRequestException ex)
            {
                GeneralModels.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: " + ex.Message
                };
                return null;
            }

            string content = await response.Content.ReadAsStringAsync();
            OAuthResponse? authResponse = OAuthResponse.FromJson(content);

            if (authResponse == null)
            {
                GeneralModels.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing auth response!"
                };
                return null;
            }

            return authResponse;
        }

        public static async Task<string?> GetAccessToken(PlugDbContext plugDbContext, IConfiguration config, uint userId)
        {
            YouPlugAuth? auth = plugDbContext.Auths.Where(a => a.userId == userId).FirstOrDefault();

            if (auth == null)
            {
                GeneralModels.ErrorMessage errorMessage = new()
                {
                    message = "Internal server error occurred: Missing auth!"
                };
                return null;
            }

            if (auth.expiresAt < new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds())
            {
                string googleTokenUrl = "https://oauth2.googleapis.com/token";
                googleTokenUrl += "?client_id=" + config.GetValue<string>("CLIENT_ID");
                googleTokenUrl += "&client_secret=" + config.GetValue<string>("CLIENT_SECRET");
                googleTokenUrl += "&grant_type=refresh_token";
                googleTokenUrl += "&refresh_token=" + auth.refreshToken;

                HttpResponseMessage response;
                try
                {
                    var client = new HttpClient();
                    var request = new HttpRequestMessage(HttpMethod.Post, googleTokenUrl);
                    response = await client.SendAsync(request);

                    if (response == null)
                        return null;
                }
                catch (HttpRequestException)
                {
                    return null;
                }

                string content = await response.Content.ReadAsStringAsync();
                OAuthResponse? authResponse = OAuthResponse.FromJson(content);

                if (authResponse == null)
                    return null;

                auth.accessToken = authResponse.access_token;
                auth.expiresAt = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds() + authResponse.expires_in;
                auth.refreshToken = authResponse.refresh_token;

                await plugDbContext.SaveChangesAsync();
            }

            return auth.accessToken;
        }
    }
}
