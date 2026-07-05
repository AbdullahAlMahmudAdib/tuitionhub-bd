using TuitionHub.Domain.Entities;

namespace TuitionHub.Domain.Interfaces;

public interface IGuardianProfileRepository
{
    Task<GuardianProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task AddAsync(GuardianProfile profile, CancellationToken ct = default);
    void Update(GuardianProfile profile);
}
