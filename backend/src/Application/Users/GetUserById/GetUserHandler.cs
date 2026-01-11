using Domain.Users;

namespace Application.Users;

public sealed class GetUserHandler(IUserRepository users)
{
    private readonly IUserRepository _users = users;

    public async Task<GetUserResult?> Handle(GetUserQuery query)
    {
        var entity = await _users.GetById(query.UserId)
            ?? throw new ArgumentException("nonexistent user id");
        
        return new(
            entity.Id,
            entity.UserType,
            entity.FullName,
            entity.Email,
            entity.PhoneNumber,
            entity.BirthDate,
            entity.City,
            entity.Institution
        );
    }
}
