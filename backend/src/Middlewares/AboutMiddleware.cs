namespace backend.src.Middlewares;

internal class AboutMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        await context.Response.WriteAsync("About page");
    }
}