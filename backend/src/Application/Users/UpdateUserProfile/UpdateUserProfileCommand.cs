namespace Application.Users;

public sealed record UpdateUserProfileCommand(
    Guid TargetUserId,
    string City,
    string Institution
);
