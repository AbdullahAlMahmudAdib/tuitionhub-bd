using FluentValidation;

namespace TuitionHub.Application.Features.Profiles.Commands.UpdateGuardianProfile;

public sealed class UpdateGuardianProfileCommandValidator : AbstractValidator<UpdateGuardianProfileCommand>
{
    public UpdateGuardianProfileCommandValidator()
    {
        RuleFor(x => x.Bio).MaximumLength(1000);
        RuleFor(x => x.Location).MaximumLength(300);
        RuleFor(x => x.ChildrenCount).GreaterThanOrEqualTo(0).When(x => x.ChildrenCount.HasValue);
        RuleFor(x => x.BudgetMin).GreaterThanOrEqualTo(0).When(x => x.BudgetMin.HasValue);
        RuleFor(x => x.BudgetMax).GreaterThanOrEqualTo(0).When(x => x.BudgetMax.HasValue);
    }
}
