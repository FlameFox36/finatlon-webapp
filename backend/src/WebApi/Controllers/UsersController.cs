using Application.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;

[ApiController]
[Route("api/users")]
public sealed class UsersController(RegisterUserHandler registerUser) : ControllerBase
{
    private readonly RegisterUserHandler _registerUser = registerUser;

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterUserRequest request
        ){
        var command = new RegisterUserCommand(
            request.UserType.ToString(),
            request.FullName,
            request.Email,
            request.PhoneNumber,
            request.BirthDate,
            request.City,
            request.Institution,
            request.Password
        );

        var userId = await _registerUser.Handle(command);

        return Created(
            $"api/users/{userId}",
            new UserCreatedResponse { UserId = userId }
        );
    }
}
