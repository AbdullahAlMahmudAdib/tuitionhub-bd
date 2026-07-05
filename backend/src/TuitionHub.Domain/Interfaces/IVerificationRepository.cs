namespace TuitionHub.Domain.Interfaces;

public record PendingVerificationInfo(Guid UserId, string FullName, string Role, string? Phone, int DocumentCount, DateTime SubmittedAt);

public interface IVerificationRepository
{
    Task<List<PendingVerificationInfo>> GetPendingVerificationsAsync(CancellationToken ct = default);
}
