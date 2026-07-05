using MediatR;

namespace TuitionHub.Application.Features.Verification.Commands.ApproveProfile;

public record ApproveProfileCommand(Guid AdminUserId, Guid UserId) : IRequest;
