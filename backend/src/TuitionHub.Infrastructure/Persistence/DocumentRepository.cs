using Microsoft.EntityFrameworkCore;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Infrastructure.Persistence;

public class DocumentRepository(AppDbContext db) : IDocumentRepository
{
    public async Task<Document?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await db.Documents.FindAsync([id], ct);

    public async Task<List<Document>> GetByUserIdAsync(Guid userId, CancellationToken ct = default) =>
        await db.Documents.Where(x => x.UserId == userId).OrderByDescending(x => x.SubmittedAt).ToListAsync(ct);

    public async Task AddAsync(Document document, CancellationToken ct = default) =>
        await db.Documents.AddAsync(document, ct);

    public void Delete(Document document) => db.Documents.Remove(document);
}
