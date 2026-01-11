using Domain.Users;

namespace Application.Users;

public interface IUserContext
{
    Guid UserId { get; }
    UserType UserType { get; }
    bool IsAdmin { get; }
}
