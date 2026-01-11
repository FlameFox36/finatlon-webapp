using System.ComponentModel.DataAnnotations.Schema;

[Table("users")]
public sealed class UserEntity
{
    public Guid Id { get; set; }

    public int UserType { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public DateOnly BirthDate { get; set; }

    public string City { get; set; } = null!;

    public string Institution { get; set; } = null!;
}
