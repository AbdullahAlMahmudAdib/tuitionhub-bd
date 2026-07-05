using Microsoft.EntityFrameworkCore;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Infrastructure.Persistence;

public class TutorProfileRepository(AppDbContext db) : ITutorProfileRepository
{
    public async Task<TutorProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct = default) =>
        await db.TutorProfiles
            .Include(x => x.Subjects)
            .Include(x => x.Qualifications)
            .FirstOrDefaultAsync(x => x.UserId == userId, ct);

    public async Task AddAsync(TutorProfile profile, CancellationToken ct = default) =>
        await db.TutorProfiles.AddAsync(profile, ct);

    public void Update(TutorProfile profile) => db.TutorProfiles.Update(profile);
}
