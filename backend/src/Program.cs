using Application.Users;
using Microsoft.EntityFrameworkCore;
using WebApi.Filters;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .AddEnvironmentVariables();

builder.Services
    .AddScoped<RegisterUserHandler>()
    .AddScoped<IUserRepository, UserRepository>()
    .AddDbContext<AppDbContext>(options => options.UseNpgsql(
        builder.Configuration.GetConnectionString("Default")
    ))
    .AddControllers(options => {
        options.Filters.Add<ExceptionMappingFilter>();
    });

// After building

var app = builder.Build();

app.Run();