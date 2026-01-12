namespace WebApi.Dtos;

public sealed class LogInUserRequest
{
    public required string Email { get; init; }
    public required string Password { get; init; }
}
