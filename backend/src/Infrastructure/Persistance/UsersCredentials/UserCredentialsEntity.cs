using System.ComponentModel.DataAnnotations.Schema;

namespace Infrastructure.UsersCredentials;

[Table("users_credentials")]
public sealed class UserCredentialsEntity
{
    public Guid UserId { get; set; }
    public int Type { get; set; }
    public string PasswordHash { get; set; } = null!;
}
