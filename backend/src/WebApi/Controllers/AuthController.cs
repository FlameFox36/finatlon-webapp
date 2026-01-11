using Application.Users;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly LoginUserHandler _login;

    public AuthController(LoginUserHandler login)
    {
        _login = login;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var result = await _login.Handle(
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
