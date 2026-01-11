using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Users;
using Domain.Users;
using Infrastructure.Auth;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Services;

public sealed class JwtTokenGenerator(JwtOptions options) : IJwtTokenGenerator
{
    private readonly JwtOptions _options = options;

    public string Generate(Guid userId, UserType userType)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim("user_type", userType.ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_options.Secret)
        );

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            )
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
