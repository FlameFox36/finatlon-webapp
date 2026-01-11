namespace WebApi.Dtos;

public sealed class GetUserByEmailRequest
{
    public required string Email { get; init; }
}
