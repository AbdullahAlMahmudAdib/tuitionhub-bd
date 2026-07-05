using TuitionHub.Domain.Entities;

namespace TuitionHub.Domain.Interfaces;

public interface ITutorProfileRepository
{
    Task<TutorProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task AddAsync(TutorProfile profile, CancellationToken ct = default);
    void Update(TutorProfile profile);
}
