using Domain.Users;

namespace Application.Users;

public sealed record GetUserByEmailResult(
    string UserType,
    string FullName,
    string Email,
    string PhoneNumber,
    DateOnly BirthDate,
    string City,
    string Institution
);
