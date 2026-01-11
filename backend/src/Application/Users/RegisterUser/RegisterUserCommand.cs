namespace Application.Users;

public sealed record RegisterUserCommand(
    string UserType,
    string FullName,
    string Email,
    string PhoneNumber,
    DateOnly BirthDate,
    string City,
    string Institution
);
