using MediatR;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Verification.Commands.VerifyOtp;

public sealed class VerifyOtpCommandHandler(
    IUserRepository userRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<VerifyOtpCommand, VerifyOtpResult>
{
    public async Task<VerifyOtpResult> Handle(VerifyOtpCommand command, CancellationToken ct)
    {
        var user = await userRepository.GetByIdAsync(command.UserId, ct)
            ?? throw new InvalidOperationException("User not found.");

        var otp = user.OtpCodes
            .Where(x => !x.IsUsed && x.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefault();

        if (otp is null)
            return new VerifyOtpResult(false, "No valid OTP found. Please request a new code.");

        if (otp.Code != command.Code)
            return new VerifyOtpResult(false, "Invalid OTP code.");

        otp.IsUsed = true;
        user.IsVerified = true;

        await userRepository.UpdateAsync(user, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return new VerifyOtpResult(true, "Phone verified successfully.");
    }
}
