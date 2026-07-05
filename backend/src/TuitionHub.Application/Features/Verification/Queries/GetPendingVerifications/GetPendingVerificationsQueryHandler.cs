using MediatR;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Verification.Queries.GetPendingVerifications;

public sealed class GetPendingVerificationsQueryHandler(IVerificationRepository verificationRepository)
    : IRequestHandler<GetPendingVerificationsQuery, List<PendingVerificationDto>>
{
    public async Task<List<PendingVerificationDto>> Handle(GetPendingVerificationsQuery query, CancellationToken ct)
    {
        var pending = await verificationRepository.GetPendingVerificationsAsync(ct);
        return pending.Select(p => new PendingVerificationDto(
            p.UserId, p.FullName, p.Role, p.Phone, p.DocumentCount, p.SubmittedAt
        )).ToList();
    }
}
