using MediatR;

namespace TuitionHub.Application.Features.Verification.Commands.SubmitForVerification;

public record SubmitForVerificationCommand(Guid UserId) : IRequest;
