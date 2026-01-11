using Domain.ValueObjects;

namespace Domain.Users;

public sealed class UserCredentials
{
    public Guid UserId { get; }
    public UserType Type { get; }
    public PasswordHash PasswordHash { get; }

    private UserCredentials(Guid userId, UserType type, PasswordHash passwordHash)
    {
        UserId = userId;
        Type = type;
        PasswordHash = passwordHash;
    }

    public static UserCredentials Create(Guid userId, UserType type, string passwordHash)
        => new(
            userId,
            type,
            PasswordHash.FromHashed(passwordHash)
        );

    public static UserCredentials Restore(
        Guid userId,
        UserType type,
        PasswordHash passwordHash)
        => new(userId, type, passwordHash);
}
