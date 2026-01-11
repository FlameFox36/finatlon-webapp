using Application.Users;
using Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;

[ApiController]
[Route("api/users")]
public sealed class UsersController(
    RegisterUserHandler registerHandler,
    LoginUserHandler loginHandler,
    GetUserByEmailHandler getUserByEmailHandler
) : ControllerBase
{
    private readonly RegisterUserHandler _registerHandler = registerHandler;
    private readonly LoginUserHandler _loginHandler = loginHandler;
    private readonly GetUserByEmailHandler _getUserByEmailHandler = getUserByEmailHandler;

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

        return Ok(new LoginResult(result.AccessToken));
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetUserByEmailEndpoint(GetUserByEmailRequest request)
    {
        var result = await _getUserByEmailHandler.Handle(
            new GetUserByEmailQuery(
                request.Email
            )
        );

        return Ok(new GetUserByEmailResponse {
            UserType = Enum.Parse<UserType>(result.UserType),
            FullName = result.FullName,
            Email = result.Email,
            PhoneNumber = result.PhoneNumber,
            BirthDate = result.BirthDate,
            City = result.City,
            Institution = result.Institution
        });
    }
}
