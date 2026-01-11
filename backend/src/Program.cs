using Application.Users;
using Infrastructure.Auth;
using Infrastructure.Users;
using Microsoft.EntityFrameworkCore;
using WebApi.Filters;
using WebApi.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .AddEnvironmentVariables();

builder.Services
    .AddOpenApi()
    .AddJwtAuthentication(builder.Configuration)
    .AddAuthorization()
    .AddScoped<RegisterUserHandler>()
    .AddScoped<IUserRepository, UserRepository>()
    .AddDbContext<AppDbContext>(options => options.UseNpgsql(
        builder.Configuration.GetConnectionString("Default")
    ))
    .AddControllers(options => {
        options.Filters.Add<ExceptionMappingFilter>();
    });

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserContext, HttpUserContext>();

builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection(JwtOptions.SectionName)
);

// After building
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi("/openapi");
}

app.Run();