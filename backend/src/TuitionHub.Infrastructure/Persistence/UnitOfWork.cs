using Microsoft.EntityFrameworkCore;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Infrastructure.Persistence;

public class UnitOfWork(AppDbContext db) : IUnitOfWork
{
    public async Task<int> SaveChangesAsync(CancellationToken ct = default) =>
        await db.SaveChangesAsync(ct);

    public async Task AddAsync<TEntity>(TEntity entity, CancellationToken ct = default) where TEntity : class
    {
        await db.Set<TEntity>().AddAsync(entity, ct);
    }
}
