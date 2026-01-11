namespace WebApi.Dtos;

public sealed class RegisterUserRequest
{
    public required string UserType { get; init; }
    public required string FullName { get; init; }
    public required string Email { get; init; }
    public required string PhoneNumber { get; init; }
    public required DateOnly BirthDate { get; init; }
    public required string City { get; init; }
    public required string Institution { get; init; }
}
