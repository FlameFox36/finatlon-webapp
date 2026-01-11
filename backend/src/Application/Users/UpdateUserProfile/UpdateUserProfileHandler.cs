namespace Application.Users;

public sealed class UpdateUserProfileHandler(IUserRepository users, IUserContext context)
{
    private readonly IUserRepository _users = users;
    private readonly IUserContext _context = context;

    public async Task Handle(UpdateUserProfileCommand cmd)
    {
        if (_context.UserId != cmd.TargetUserId && !_context.IsAdmin)
            throw new ApplicationException("Access denied");

        var user = await _users.GetById(cmd.TargetUserId)
            ?? throw new ApplicationException("User not found");

        user.ChangeInstitution(cmd.Institution);

        await _users.Save(user);
    }
}
