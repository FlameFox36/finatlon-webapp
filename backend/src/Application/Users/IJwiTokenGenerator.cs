using Domain.Users;

namespace Application.Users;

public interface IJwtTokenGenerator
{
    string Generate(Guid userId, UserType userType);
}
