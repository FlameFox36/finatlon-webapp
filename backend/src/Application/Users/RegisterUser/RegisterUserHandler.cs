using Domain.Users;
using Domain.ValueObjects;

namespace Application.Users;

public sealed class RegisterUserHandler(IUserRepository users)
{
    private readonly IUserRepository _users = users;

    public async Task<Guid> Handle(RegisterUserCommand command)
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

        await _users.Save(user);
        return user.Id;
    }
}
