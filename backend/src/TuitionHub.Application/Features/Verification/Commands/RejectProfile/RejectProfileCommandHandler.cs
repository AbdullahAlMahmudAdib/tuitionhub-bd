using MediatR;
using TuitionHub.Domain.Enums;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Verification.Commands.RejectProfile;

public sealed class RejectProfileCommandHandler(
    IUserRepository userRepository,
    IDocumentRepository documentRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<RejectProfileCommand>
{
    public async Task Handle(RejectProfileCommand command, CancellationToken ct)
    {
        var user = await userRepository.GetByIdAsync(command.UserId, ct)
            ?? throw new InvalidOperationException("User not found.");

        var docs = await documentRepository.GetByUserIdAsync(command.UserId, ct);
        foreach (var doc in docs)
        {
            if (doc.Status == VerificationStatus.Pending)
            {
                doc.Status = VerificationStatus.Rejected;
                doc.ReviewerId = command.AdminUserId;
                doc.ReviewNotes = command.Reason;
                doc.ReviewedAt = DateTime.UtcNow;
            }
        }

        await unitOfWork.SaveChangesAsync(ct);
    }
}
