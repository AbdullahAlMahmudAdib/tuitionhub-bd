using MediatR;

namespace TuitionHub.Application.Features.Verification.Commands.RejectProfile;

public record RejectProfileCommand(Guid AdminUserId, Guid UserId, string Reason) : IRequest;
