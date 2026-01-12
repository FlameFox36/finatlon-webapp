using Domain.Exceptions;

namespace Domain.ValueObjects;

public sealed class PhoneNumber
{
    public string Value { get; }

    private PhoneNumber(string value)
    {
        Value = value;
    }

    public static PhoneNumber Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException("Phone number is required");

        // Минимальная версия, можно улучшить
        if (!value.StartsWith('+'))
            throw new DomainException("Phone number must be in E.164 format");

        return new PhoneNumber(value);
    }

    public override string ToString() => Value;

    public override bool Equals(object? obj)
        => obj is PhoneNumber other && Value == other.Value;

    public override int GetHashCode()
        => Value.GetHashCode();
}
