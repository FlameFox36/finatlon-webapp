using System.Text.Json;
using System.Text.Json.Serialization;
using Application.Users;
using Application.UsersCredentials;
using Infrastructure.Auth;
using Infrastructure.Services;
using Infrastructure.Users;
using Microsoft.EntityFrameworkCore;
using WebApi.Filters;
using WebApi.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .AddEnvironmentVariables();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Строка подключения к БД не найдена");

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Jwt"));

builder.Services
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
    .AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString))
    .AddControllers(options => {
        options.Filters.Add<ExceptionMappingFilter>();
    })
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(
        new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
    ));

builder.Services.AddHttpContextAccessor();

builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection(JwtOptions.SectionName)
);

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: "AllowAllOrigins",
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
    );
});

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddOpenApi();
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi("/openapi");
    app.UseDeveloperExceptionPage();
}

app.UseRouting();
app.UseCors("AllowAllOrigins");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();