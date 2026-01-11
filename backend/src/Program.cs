using System.Data.Common;
using System.Text.Json;
using System.Text.Json.Serialization;
using Application.Users;
using Application.UsersCredentials;
using Infrastructure.Auth;
using Infrastructure.Services;
using Infrastructure.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Protocols.Configuration;
using WebApi.Filters;
using WebApi.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .AddEnvironmentVariables();

var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? throw new InvalidConfigurationException("Environment variable DATABASE_URL is not set");

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Jwt"));

builder.Services
    .AddOpenApi()
    .AddLogging()
    .AddJwtAuthentication(builder.Configuration)
    .AddAuthorization()
    .AddScoped<RegisterUserHandler>()
    .AddScoped<LoginUserHandler>()
    .AddScoped<GetUserByEmailHandler>()
    .AddScoped<IUserRepository, UserRepository>()
    .AddScoped<IUserCredentialsRepository, UserCredentialsRepository>()
    .AddScoped<IUserContext, HttpUserContext>()
    .AddScoped<IPasswordHasher, PasswordHasher>()
    .AddScoped<IJwtTokenGenerator, JwtTokenGenerator>()
    .AddDbContext<AppDbContext>(options => options.UseNpgsql(databaseUrl))
    .AddControllers(options => {
        options.Filters.Add<ExceptionMappingFilter>();
    });

builder.Services.AddHttpContextAccessor();

builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection(JwtOptions.SectionName)
);

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    o.JsonSerializerOptions.Converters.Add(
        new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
    ));

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(
            "AllowAllOrigins",
            builder => builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
        );
    });
}

// After building
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi("/openapi");
    app.UseDeveloperExceptionPage();
    app.UseCors("AllowAllOrigins");
}

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();