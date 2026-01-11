using Domain.Users;
using Domain.ValueObjects;

namespace Application.Users;

public sealed record GetUserResult(
    Guid Id,
    UserType Type,
    string FullName,
    Email Email,
    PhoneNumber PhoneNumber,
    DateOnly BirthDate,
    string City,
    string Institution
);
