using backend.src.Middlewares;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi("/openapi");
}

app.Map("/about", async (context) =>
{
    context.UseMiddleware<AboutMiddleware>();
});

app.Map("/", async (context) =>
{
    context.UseMiddleware<HelloMiddleware>();
});

app.Run();