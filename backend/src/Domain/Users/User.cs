using Domain.Exceptions;
using Domain.ValueObjects;

namespace Domain.Users;

internal sealed class User
{
    public Guid Id { get; }
    public UserType UserType { get; }
    public string FullName { get; }
    public Email Email { get; }
    public PhoneNumber PhoneNumber { get; }
    public DateOnly BirthDate { get; }
    public string City { get; }
    public string Institution { get; }

    private User(
        Guid id,
        UserType userType,
        string fullName,
        Email email,
        PhoneNumber phoneNumber,
        DateOnly birthDate,
        string city,
        string institution)
    {
        Id = id;
        UserType = userType;
        FullName = fullName;
        Email = email;
        PhoneNumber = phoneNumber;
        BirthDate = birthDate;
        City = city;
        Institution = institution;
    }

    public static User Create(
        UserType userType,
        string fullName,
        Email email,
        PhoneNumber phoneNumber,
        DateOnly birthDate,
        string city,
        string institution)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            throw new DomainException("Full name is required");

        if (birthDate > DateOnly.FromDateTime(DateTime.UtcNow))
            throw new DomainException("Birth date cannot be in the future");

        return new User(
            Guid.NewGuid(),
            userType,
            fullName.Trim(),
            email,
            phoneNumber,
            birthDate,
            city.Trim(),
            institution.Trim()
        );
    }
}
