using TuitionHub.Domain.Entities;

namespace TuitionHub.Domain.Interfaces;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenHashAsync(string tokenHash, CancellationToken ct = default);
    Task AddAsync(RefreshToken token, CancellationToken ct = default);
    Task RevokeUserTokensAsync(Guid userId, CancellationToken ct = default);
}
