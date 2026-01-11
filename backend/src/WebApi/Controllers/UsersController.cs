using Application.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;

[ApiController]
[Route("api/users")]
public sealed class UsersController(
    RegisterUserHandler registerHandler,
    LoginUserHandler loginHandler
) : ControllerBase
{
    private readonly RegisterUserHandler _registerHandler = registerHandler;
    private readonly LoginUserHandler _loginHandler = loginHandler;

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> RegisterEndpoint(
        [FromBody] RegisterUserRequest request
        ){

        var result = await _registerHandler.Handle(
            new RegisterUserCommand(
                request.UserType.ToString(),
                request.FullName,
                request.Email,
                request.PhoneNumber,
                request.BirthDate,
                request.City,
                request.Institution,
                request.Password
            )    
        );
        
        return Created(
            $"api/users/{result}",
            new RegisterUserResponse { UserId = result.Id }
        );
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> LoginEndpoint(LoginRequest request)
    {
        var result = await _loginHandler.Handle(
            new LoginUserCommand(
                request.Email,
                request.Password
            )
        );

        return Ok(new
        {
            accessToken = result.AccessToken
        });
    }
}
