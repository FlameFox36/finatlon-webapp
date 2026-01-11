namespace Application.Users;

public sealed class GetUserHandler(IUserRepository users)
{
    private readonly IUserRepository _users = users;

    public async Task<Guid> Handle(GetUserQuery query)
    {
        throw new NotImplementedException();
    }
}
