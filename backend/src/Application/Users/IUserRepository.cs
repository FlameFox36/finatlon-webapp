using Domain.Users;

namespace Application.Users;

public interface IUserRepository
{
    Task Save(User user);
    Task<User?> GetById(Guid id);
}
