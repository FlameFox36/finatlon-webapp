using Domain.Exceptions;

namespace Domain.ValueObjects;

public sealed class PasswordHash
{
    public string Value { get; }

    private PasswordHash(string value) => Value = value;

    public static PasswordHash FromPlainText(string value) => new(value);

    public static PasswordHash FromHashed(string hash)
    {
        if (string.IsNullOrWhiteSpace(hash))
            throw new DomainException("Password hash cannot be empty");

        return new PasswordHash(hash);
    }
}
