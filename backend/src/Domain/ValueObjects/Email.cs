using Domain.Exceptions;

namespace Domain.ValueObjects;

internal sealed class Email
{
    public string Value { get; }

    private Email(string value)
    {
        Value = value;
    }

    public static Email Create(string value)
    {
        if (!System.Net.Mail.MailAddress.TryCreate(value, out var mail))
            throw new DomainException("Invalid email format");

        return new Email(mail.Address.ToLowerInvariant());
    }

    public override string ToString() => Value;

    public override bool Equals(object? obj)
        => obj is Email other && Value == other.Value;

    public override int GetHashCode()
        => Value.GetHashCode();
}
