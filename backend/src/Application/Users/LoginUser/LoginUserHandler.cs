using Application.Users;
using Application.UsersCredentials;
using Domain.ValueObjects;

public sealed class LoginUserHandler(
    IUserCredentialsRepository credentialsRepository,
    IPasswordHasher passwordHasher,
    IJwtTokenGenerator jwtTokenGenerator
) {
    private readonly IUserCredentialsRepository _credentialsRepository = credentialsRepository;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator = jwtTokenGenerator;

    public async Task<LoginResult> Handle(LoginUserCommand cmd)
    {
        var email = Email.Create(cmd.Email);

        var credentials = await _credentialsRepository.GetByEmail(email)
            ?? throw new ApplicationException("Invalid email");
        
        if (!_passwordHasher.Verify(cmd.Password, credentials.PasswordHash.Value))
            throw new ApplicationException("Invalid credentials");

        var accessToken = _jwtTokenGenerator.Generate(
            credentials.UserId, credentials.Type
        );

        return new LoginResult(accessToken);
    }
}
