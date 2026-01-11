using Application.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;

[ApiController]
[Route("api/users")]
public sealed class UsersController : ControllerBase
{
    private readonly RegisterUserHandler _registerUser;

    public UsersController(RegisterUserHandler registerUser)
    {
        _registerUser = registerUser;
    }

    [HttpPost]
    public async Task<IActionResult> Register(
        [FromBody] RegisterUserRequest request)
    {
        var command = new RegisterUserCommand(
            request.UserType,
            request.FullName,
            request.Email,
            request.PhoneNumber,
            request.BirthDate,
            request.City,
            request.Institution
        );

        var userId = await _registerUser.Handle(command);

        return Created(
            $"api/users/{userId}",
            new UserCreatedResponse { UserId = userId }
        );
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateUserProfileCommand request,
        UpdateUserProfileHandler handler
    ){
        await handler.Handle(
            new UpdateUserProfileCommand(
                id,
                request.City,
                request.Institution
            )
        );

        return NoContent();
    }
}
