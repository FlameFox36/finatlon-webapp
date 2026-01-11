using Application.Users;
using Application.UsersCredentials;
using Domain.ValueObjects;

public sealed class LoginUserHandler
{
    private readonly IUserCredentialsRepository _credentials;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtTokenGenerator _jwt;

    public LoginUserHandler(
        IUserCredentialsRepository credentials,
        IPasswordHasher hasher,
        IJwtTokenGenerator jwt)
    {
        _credentials = credentials;
        _hasher = hasher;
        _jwt = jwt;
    }

    public async Task<LoginResult> Handle(LoginUserCommand cmd)
    {
        var email = Email.Create(cmd.Email);

        var credentials = await _credentials.GetByEmail(email);
        if (credentials is null)
            throw new ApplicationException("Invalid credentials");

        if (!_hasher.Verify(
                cmd.Password,
                credentials.PasswordHash.Value))
            throw new ApplicationException("Invalid credentials");

        var accessToken = _jwt.Generate(
            credentials.UserId, credentials.Type
        );

        return new LoginResult(accessToken);
    }
}
