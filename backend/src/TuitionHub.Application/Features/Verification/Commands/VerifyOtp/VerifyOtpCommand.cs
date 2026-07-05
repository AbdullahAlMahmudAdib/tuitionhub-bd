using MediatR;

namespace TuitionHub.Application.Features.Verification.Commands.VerifyOtp;

public record VerifyOtpCommand(Guid UserId, string Code) : IRequest<VerifyOtpResult>;

public record VerifyOtpResult(bool Success, string Message);
