using Application.Users;
using Domain.Users;

namespace Infrastructure.Users;

public sealed class HttpUserContext : IUserContext
{
    public Guid UserId { get; }
    public UserType UserType { get; }
    public bool IsAdmin { get; }

    public HttpUserContext(IHttpContextAccessor accessor)
    {
        var user = accessor.HttpContext!.User;

        UserId = Guid.Parse(user.FindFirst("sub")!.Value);
        UserType = Enum.Parse<UserType>(
            user.FindFirst("user_type")!.Value
        );

        IsAdmin = user.IsInRole("Admin");
    }
}
