using YouPlug.Db;
using YouPlug.Dto;
using YouPlug.Models;

namespace YouPlug.Services
{
    public class TokenService
    {

        public static async Task<OAuthResponseDto?> ExchangeAuthCode(string state, string code)
        {
            string googleTokenUrl = "https://oauth2.googleapis.com/token";
            googleTokenUrl += "?client_id=" + Environment.GetEnvironmentVariable("CLIENT_ID", EnvironmentVariableTarget.Process);
            googleTokenUrl += "&client_secret=" + Environment.GetEnvironmentVariable("CLIENT_SECRET", EnvironmentVariableTarget.Process);
            googleTokenUrl += "&redirect_uri=" + Environment.GetEnvironmentVariable("OAUTH2_CALLBACK", EnvironmentVariableTarget.Process);
            googleTokenUrl += "&grant_type=authorization_code";
            googleTokenUrl += "&code=" + code;
            googleTokenUrl += "&access_type=offline";

            HttpResponseMessage response;
            try
            {
                var client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Post, googleTokenUrl);
                response = await client.SendAsync(request);

                if (response == null)
                {
                    Console.WriteLine("Error (ExchangeAuthCode) : " + "Response is null");
                    return null;
                }
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine("Error (ExchangeAuthCode) : " + ex.Message);
                return null;
            }

            string content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(content);
            OAuthResponseDto? authResponse = OAuthResponseDto.FromJson(content);

            if (authResponse == null || authResponse.access_token == null)
            {
                Console.WriteLine("Error (ExchangeAuthCode) : " + "AuthResponse or access_token is null");
                return null;
            }
            Console.WriteLine("AuthResponse : " + authResponse.access_token);
            Console.WriteLine("AuthResponse : " + authResponse.refresh_token);
            Console.WriteLine("AuthResponse : " + authResponse.expires_in);
            Console.WriteLine("AuthResponse : " + authResponse.scope);
            Console.WriteLine("AuthResponse : " + authResponse.token_type);
            return authResponse;
        }

        public static async Task<string?> GetAccessToken(PlugDbContext plugDbContext, uint userId)
        {
            YouPlugAuthModel? auth = plugDbContext.Auths.Where(a => a.userId == userId).FirstOrDefault();

            if (auth == null)
            {
                Console.WriteLine("Error (GetAccessToken) : " + "Auth is null");
                return null;
            }

            if (auth.expiresAt < new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds())
            {
                string googleTokenUrl = "https://oauth2.googleapis.com/token";
                googleTokenUrl += "?client_id=" + Environment.GetEnvironmentVariable("CLIENT_ID", EnvironmentVariableTarget.Process);
                googleTokenUrl += "&client_secret=" + Environment.GetEnvironmentVariable("CLIENT_SECRET", EnvironmentVariableTarget.Process);
                googleTokenUrl += "&grant_type=refresh_token";
                googleTokenUrl += "&refresh_token=" + auth.refreshToken;

                HttpResponseMessage response;
                try
                {
                    var client = new HttpClient();
                    var request = new HttpRequestMessage(HttpMethod.Post, googleTokenUrl);
                    response = await client.SendAsync(request);

                    if (response == null)
                    {
                        Console.WriteLine("Error (GetAccessToken) : " + "Response is null");
                        return null;
                    }
                }
                catch (HttpRequestException ex)
                {
                    Console.WriteLine("Error (GetAccessToken) : " + ex.Message);
                    return null;
                }

                string content = await response.Content.ReadAsStringAsync();
                OAuthResponseDto? authResponse = OAuthResponseDto.FromJson(content);

                if (authResponse == null || authResponse.refresh_token == null)
                {
                    Console.WriteLine("Error (GetAccessToken) : " + "AuthResponse or .RefreshToken is null");
                    return null;
                }

                auth.accessToken = authResponse.access_token;
                auth.expiresAt = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds() + authResponse.expires_in;
                auth.refreshToken = authResponse.refresh_token;

                await plugDbContext.SaveChangesAsync();
            }

            return auth.accessToken;
        }
    }
}
