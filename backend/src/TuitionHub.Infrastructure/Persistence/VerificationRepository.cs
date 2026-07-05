using Microsoft.EntityFrameworkCore;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Infrastructure.Persistence;

public class VerificationRepository(AppDbContext db) : IVerificationRepository
{
    public async Task<List<PendingVerificationInfo>> GetPendingVerificationsAsync(CancellationToken ct = default) =>
        await db.Users
            .Where(u => !u.IsVerified && u.Documents.Any())
            .Select(u => new PendingVerificationInfo(
                u.Id,
                u.FullName,
                u.Role.ToString(),
                u.Phone,
                u.Documents.Count,
                u.Documents.Max(d => d.SubmittedAt)
            ))
            .ToListAsync(ct);
}
