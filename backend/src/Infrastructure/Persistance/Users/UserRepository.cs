using Application.Users;
using Domain.Users;
using Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Users;

public sealed class UserRepository(AppDbContext db) : IUserRepository
{
    private readonly AppDbContext _db = db;

    public async Task Save(User user)
    {
        var entity = ToEntity(user);
        _db.Users.Add(entity);
        await _db.SaveChangesAsync();
    }

    public async Task<User?> GetById(Guid id)
    {
        var entity = await _db.Users.FindAsync(id);
        return entity is null ? null : ToDomain(entity);
    }

    public async Task<User?> GetByEmail(Email email)
    {
        var entity = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == email.Value);

        return entity is null ? null : ToDomain(entity);
    }


    private static UserEntity ToEntity(User user) => new()
    {
        Id = user.Id,
        UserType = (int)user.UserType,
        FullName = user.FullName,
        Email = user.Email.Value,
        PhoneNumber = user.PhoneNumber.Value,
        BirthDate = user.BirthDate,
        City = user.City,
        Institution = user.Institution
    };

    private static User ToDomain(UserEntity e)
    => User.Restore(
        e.Id,
        (UserType)e.UserType,
        e.FullName,
        Email.Create(e.Email),
        PhoneNumber.Create(e.PhoneNumber),
        e.BirthDate,
        e.City,
        e.Institution
    );
}
