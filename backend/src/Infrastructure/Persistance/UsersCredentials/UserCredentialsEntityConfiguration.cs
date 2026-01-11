using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.UsersCredentials;

public sealed class UserCredentialsEntityConfiguration : IEntityTypeConfiguration<UserCredentialsEntity>
{
    public void Configure(EntityTypeBuilder<UserCredentialsEntity> builder)
    {
        builder.ToTable("users");
        builder.HasKey(entity => entity.UserId);
    }
}

