using MediatR;

namespace TuitionHub.Application.Features.Verification.Queries.GetPendingVerifications;

public record GetPendingVerificationsQuery : IRequest<List<PendingVerificationDto>>;

public record PendingVerificationDto(
    Guid UserId,
    string FullName,
    string Role,
    string? Phone,
    int DocumentCount,
    DateTime SubmittedAt
);
