using MediatR;

namespace TuitionHub.Application.Features.Verification.Commands.RequestOtp;

public record RequestOtpCommand(Guid UserId, string Phone) : IRequest;

public record RequestOtpResult(bool Success, string Message);
