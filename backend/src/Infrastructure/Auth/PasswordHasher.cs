using Application.Users;

namespace Infrastructure.Auth;

public sealed class PasswordHasher : IPasswordHasher
{
    public bool Verify(string password, string passwordHash)
        => BCrypt.Net.BCrypt.Verify(password, passwordHash);

    public string Hash(string password)
        => BCrypt.Net.BCrypt.HashPassword(password);
}
