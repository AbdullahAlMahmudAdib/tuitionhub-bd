using FluentValidation;

namespace TuitionHub.Application.Features.Verification.Commands.RequestOtp;

public sealed class RequestOtpCommandValidator : AbstractValidator<RequestOtpCommand>
{
    public RequestOtpCommandValidator()
    {
        RuleFor(x => x.Phone)
            .NotEmpty()
            .Matches(@"^\+8801[3-9]\d{8}$")
            .WithMessage("Phone must be a valid Bangladeshi number (+8801XXXXXXXXX).");
    }
}
