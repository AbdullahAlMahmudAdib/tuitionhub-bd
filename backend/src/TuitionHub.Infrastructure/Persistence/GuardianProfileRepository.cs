using Microsoft.EntityFrameworkCore;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Infrastructure.Persistence;

public class GuardianProfileRepository(AppDbContext db) : IGuardianProfileRepository
{
    public async Task<GuardianProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct = default) =>
        await db.GuardianProfiles.FirstOrDefaultAsync(x => x.UserId == userId, ct);

    public async Task AddAsync(GuardianProfile profile, CancellationToken ct = default) =>
        await db.GuardianProfiles.AddAsync(profile, ct);

    public void Update(GuardianProfile profile) => db.GuardianProfiles.Update(profile);
}
