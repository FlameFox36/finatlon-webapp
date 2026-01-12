using System.Net;
using Application.UsersCredentials;
using Domain.Users;
using Domain.ValueObjects;
using Infrastructure.UsersCredentials;
using Microsoft.EntityFrameworkCore;


public sealed class UserCredentialsRepository(AppDbContext db)
    : IUserCredentialsRepository
{
    private readonly AppDbContext _db = db;

    public async Task Save(UserCredentials credentials)
    {
        var entity = ToEntity(credentials);
        _db.UsersCredentials.Add(entity);
        await _db.SaveChangesAsync();
    }

    public async Task<UserCredentials?> GetById(Guid id)
    {
        var credentialsEntity = await _db.UsersCredentials
            .FindAsync(id);

        if (credentialsEntity is null)
            return null;

        return ToDomain(credentialsEntity);
    }

    public async Task<UserCredentials?> GetByEmail(Email email)
    {
        var userEntity = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == email.Value);

        if (userEntity is null)
            return null;

        return await GetById(userEntity.Id);
    }

    private static UserCredentialsEntity ToEntity(UserCredentials credentials) => new()
    {
        UserId = credentials.UserId,
        Type = (int)credentials.Type,
        PasswordHash = credentials.PasswordHash.Value,
    };

    private static UserCredentials ToDomain(UserCredentialsEntity e)
    => UserCredentials.Restore(
        e.UserId,
        (UserType)e.Type,
        PasswordHash.FromPlainText(e.PasswordHash)
    );
}
