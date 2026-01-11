using Application.UsersCredentials;
using Domain.Users;
using Domain.ValueObjects;

namespace Application.Users;

public sealed class RegisterUserHandler(IUserRepository users, IUserCredentialsRepository credentials, IPasswordHasher passwordHasher)
{
    private readonly IUserRepository _users = users;
    private readonly IUserCredentialsRepository _credentials = credentials;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;

    public async Task<RegisterUserResult> Handle(RegisterUserCommand command)
    {
        var userType = Enum.Parse<UserType>(command.UserType);

        var email = Email.Create(command.Email);
        var phone = PhoneNumber.Create(command.PhoneNumber);

        var user = User.Create(
            userType,
            command.FullName,
            email,
            phone,
            command.BirthDate,
            command.City,
            command.Institution
        );

        var credentials = UserCredentials.Create(
            user.Id,
            userType,
            _passwordHasher.Hash(command.Password)
        );

        await _users.Save(user);
        await _credentials.Save(credentials);

        return new RegisterUserResult(user.Id);
    }
}
