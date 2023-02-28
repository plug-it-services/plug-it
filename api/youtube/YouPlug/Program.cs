using Microsoft.EntityFrameworkCore;
using System.Collections;
using YouPlug.Db;
using YouPlug.Services;

bool plugRegistration = await PlugRegistration.RegisterPlug();

if (!plugRegistration)
{
    Console.WriteLine("Unable to register plug!");
    return;
}
Console.WriteLine("Plug should be registered!");

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

string? corsAllow = Environment.GetEnvironmentVariable("CORS_ORIGIN", EnvironmentVariableTarget.Process);

if (string.IsNullOrWhiteSpace(corsAllow))
{
    Console.WriteLine("Missing CORS_ORIGIN environment variable!");
    Console.WriteLine("Missing CORS_ORIGIN environment variable!");
    return;
}

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins(corsAllow);
        builder.AllowCredentials();
        builder.AllowAnyHeader();
        builder.AllowAnyMethod();
    });
});

Console.WriteLine("Configuring database connection...");

// Print all env variables to console for debugging purposes (.NET 6, without DictionaryEntry)
foreach (DictionaryEntry envVariable in Environment.GetEnvironmentVariables())
{
    Console.WriteLine($"{envVariable.Key}={envVariable.Value}");
}

string? host = Environment.GetEnvironmentVariable("POSTGRES_HOST", EnvironmentVariableTarget.Process);
string? userName = Environment.GetEnvironmentVariable("POSTGRES_USER", EnvironmentVariableTarget.Process);
string? password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD", EnvironmentVariableTarget.Process);
string? databaseName = Environment.GetEnvironmentVariable("POSTGRES_DB", EnvironmentVariableTarget.Process);

// throw exception if any of the required configuration values are missing
if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(userName)
    || string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(databaseName))
{
    Console.WriteLine("Missing configuration values for database connection!");
    return;
}

string connectionString = string.Format("Host={0};Username={1};Password={2};Database={3}",
    host, userName, password, databaseName);

Console.WriteLine($"Connection string: {connectionString}");

builder.Services.AddDbContext<PlugDbContext>(options =>
    options.UseNpgsql(connectionString, b => b.MigrationsAssembly("YouPlug"))
);

using (var context = new PlugDbContext(builder.Services.BuildServiceProvider().GetService<DbContextOptions<PlugDbContext>>()))
{
    context.Database.EnsureCreated();
    context.Database.Migrate();
}

// recover permanent db context
var _context = new PlugDbContext(builder.Services.BuildServiceProvider().GetService<DbContextOptions<PlugDbContext>>());
YouPlug.Program.fetcherService = new TubeFetcherService(_context);
YouPlug.Program.fetcherService?.Start();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

namespace YouPlug
{
    class Program
    {
        public static TubeFetcherService? fetcherService = null;
    }
}
