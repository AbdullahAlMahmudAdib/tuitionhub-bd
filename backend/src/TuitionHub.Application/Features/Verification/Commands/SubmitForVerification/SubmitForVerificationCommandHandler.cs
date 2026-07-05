using MediatR;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Verification.Commands.SubmitForVerification;

public sealed class SubmitForVerificationCommandHandler(
    IUserRepository userRepository,
    IDocumentRepository documentRepository)
    : IRequestHandler<SubmitForVerificationCommand>
{
    public async Task Handle(SubmitForVerificationCommand command, CancellationToken ct)
    {
        var user = await userRepository.GetByIdAsync(command.UserId, ct)
            ?? throw new InvalidOperationException("User not found.");

        if (!user.IsVerified)
            throw new InvalidOperationException("Phone must be verified before submitting for review.");

        var docs = await documentRepository.GetByUserIdAsync(command.UserId, ct);
        if (docs.Count == 0)
            throw new InvalidOperationException("At least one document is required for verification.");
    }
}
