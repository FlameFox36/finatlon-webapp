using Domain.Users;
using Domain.ValueObjects;

namespace Application.Users;

public interface IUserRepository
{
    Task Save(User user);
    Task<User?> GetById(Guid id);
    Task<User?> GetByEmail(Email email);
}
