using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Users;

public sealed class UserEntityConfiguration : IEntityTypeConfiguration<UserEntity>
{
    public void Configure(EntityTypeBuilder<UserEntity> builder)
    {
        builder.ToTable("users");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.UserType)
            .IsRequired();

        builder.Property(x => x.FullName)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(x => x.Email)
            .HasMaxLength(320)
            .IsRequired();

        builder.HasIndex(x => x.Email)
            .IsUnique();

        builder.Property(x => x.PhoneNumber)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(x => x.BirthDate)
            .HasColumnType("date")
            .IsRequired();

        builder.Property(x => x.City)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(x => x.Institution)
            .HasMaxLength(255)
            .IsRequired();
    }
}

