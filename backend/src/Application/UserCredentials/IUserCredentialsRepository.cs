using Domain.ValueObjects;
using Domain.Users;

namespace Application.UsersCredentials;

public interface IUserCredentialsRepository
{
    Task Save(UserCredentials user);
    Task<UserCredentials?> GetById(Guid id);
    Task<UserCredentials?> GetByEmail(Email email);
}
