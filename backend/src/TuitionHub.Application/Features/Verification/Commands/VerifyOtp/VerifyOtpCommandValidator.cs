using FluentValidation;

namespace TuitionHub.Application.Features.Verification.Commands.VerifyOtp;

public sealed class VerifyOtpCommandValidator : AbstractValidator<VerifyOtpCommand>
{
    public VerifyOtpCommandValidator()
    {
        RuleFor(x => x.Code).NotEmpty().Length(6).Matches(@"^\d{6}$");
    }
}
