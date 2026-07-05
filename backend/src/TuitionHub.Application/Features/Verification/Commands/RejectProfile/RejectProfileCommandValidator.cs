using FluentValidation;

namespace TuitionHub.Application.Features.Verification.Commands.RejectProfile;

public sealed class RejectProfileCommandValidator : AbstractValidator<RejectProfileCommand>
{
    public RejectProfileCommandValidator()
    {
        RuleFor(x => x.Reason).NotEmpty().MaximumLength(500);
    }
}
