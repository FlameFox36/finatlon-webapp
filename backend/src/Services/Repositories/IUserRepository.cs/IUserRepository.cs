using backend.src.Schemas;

namespace backend.src.Services.Repositories;

internal interface IUserRepository
{
    User GetUser(Guid guid);
}