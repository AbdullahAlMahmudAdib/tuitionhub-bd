using MediatR;
using TuitionHub.Domain.Enums;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Verification.Commands.ApproveProfile;

public sealed class ApproveProfileCommandHandler(
    IUserRepository userRepository,
    IDocumentRepository documentRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<ApproveProfileCommand>
{
    public async Task Handle(ApproveProfileCommand command, CancellationToken ct)
    {
        var user = await userRepository.GetByIdAsync(command.UserId, ct)
            ?? throw new InvalidOperationException("User not found.");

        user.IsVerified = true;
        await userRepository.UpdateAsync(user, ct);

        var docs = await documentRepository.GetByUserIdAsync(command.UserId, ct);
        foreach (var doc in docs)
        {
            if (doc.Status == VerificationStatus.Pending)
            {
                doc.Status = VerificationStatus.Approved;
                doc.ReviewerId = command.AdminUserId;
                doc.ReviewedAt = DateTime.UtcNow;
            }
        }

        await unitOfWork.SaveChangesAsync(ct);
    }
}
