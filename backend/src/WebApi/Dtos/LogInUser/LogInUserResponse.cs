using Domain.Users;

namespace WebApi.Dtos;

public sealed class LogInUserResponse
{
    public required Guid UserId { get; init; }
    public required UserType UserType { get; init; } 
}
