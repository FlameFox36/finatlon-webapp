using Domain.Users;

namespace WebApi.Dtos;

public sealed class GetUserByEmailResponse
{
    public required UserType UserType { get; init; }
    public required string FullName { get; init; }
    public required string Email { get; init; }
    public required string PhoneNumber { get; init; }
    public required DateOnly BirthDate { get; init; }
    public required string City { get; init; }
    public required string Institution { get; init; }
}
