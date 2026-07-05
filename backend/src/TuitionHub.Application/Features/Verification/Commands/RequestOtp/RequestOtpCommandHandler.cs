using MediatR;
using Microsoft.Extensions.Logging;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Enums;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Verification.Commands.RequestOtp;

public sealed class RequestOtpCommandHandler(
    IUserRepository userRepository,
    IUnitOfWork unitOfWork,
    ILogger<RequestOtpCommandHandler> logger)
    : IRequestHandler<RequestOtpCommand>
{
    public async Task Handle(RequestOtpCommand command, CancellationToken ct)
    {
        var user = await userRepository.GetByIdAsync(command.UserId, ct)
            ?? throw new InvalidOperationException("User not found.");

        var code = new Random().Next(100000, 999999).ToString();

        var otp = new OtpCode
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Code = code,
            Type = OtpType.PhoneVerification,
            IsUsed = false,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            CreatedAt = DateTime.UtcNow
        };

        await unitOfWork.AddAsync(otp, ct);
        await unitOfWork.SaveChangesAsync(ct);

        // Dev: log OTP to console (SMS gateway integration in Phase 7)
        logger.LogInformation("[OTP] Code {Code} sent to {Phone} for user {UserId}", code, command.Phone, command.UserId);
    }
}
