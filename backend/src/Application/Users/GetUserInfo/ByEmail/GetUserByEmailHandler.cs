using Application.Users;
using Domain.ValueObjects;

public sealed class GetUserByEmailHandler(
    IUserRepository userRepository
) {
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<GetUserByEmailResult> Handle(GetUserByEmailQuery cmd)
    {
        var email = Email.Create(cmd.Email);

        var entity = await _userRepository.GetByEmail(email)
            ?? throw new ApplicationException("Invalid email");

        return new GetUserByEmailResult(
            entity.UserType.ToString(),
            entity.FullName,
            entity.Email.Value,
            entity.PhoneNumber.Value,
            entity.BirthDate,
            entity.City,
            entity.Institution
        );
    }
}
