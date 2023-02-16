using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Text;
using YouPlug;
using YouPlug.Models;

/*bool plugRegistration = await RegisterPlug();

if (!plugRegistration)
{
    Console.WriteLine("Unable to register plug!");
    //return;
Console.WriteLine("Plug should be registered!");
}*/

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

Console.WriteLine("Configuring database connection...");
string? host = Environment.GetEnvironmentVariable("POSTGRES_HOST");
string? userName = Environment.GetEnvironmentVariable("POSTGRES_USER");
string? password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
string? databaseName = Environment.GetEnvironmentVariable("POSTGRES_DB");

// throw exception if any of the required configuration values are missing
if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(userName)
    || string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(databaseName))
{
    throw new Exception("Missing configuration values to setup database connection!");
}

string connectionString = string.Format("Host={0};user id={1},password={2},database={3}",
    host, userName, password, databaseName);

builder.Services.AddDbContext<PlugDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString(connectionString))
);

// Check
using (var context = new PlugDbContext(builder.Services.BuildServiceProvider().GetService<DbContextOptions<PlugDbContext>>()))
{
    context.Database.EnsureCreated();
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();