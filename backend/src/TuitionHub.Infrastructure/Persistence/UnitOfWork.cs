using TuitionHub.Domain.Interfaces;
using TuitionHub.Infrastructure.Persistence;

namespace TuitionHub.Infrastructure.Persistence;

public class UnitOfWork(AppDbContext db) : IUnitOfWork
{
    public async Task<int> SaveChangesAsync(CancellationToken ct = default) =>
        await db.SaveChangesAsync(ct);
}
