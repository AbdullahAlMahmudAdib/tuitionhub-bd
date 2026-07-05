using FluentValidation;

namespace TuitionHub.Application.Features.Profiles.Commands.UpdateTutorProfile;

public sealed class UpdateTutorProfileCommandValidator : AbstractValidator<UpdateTutorProfileCommand>
{
    public UpdateTutorProfileCommandValidator()
    {
        RuleFor(x => x.Bio).MaximumLength(1000);
        RuleFor(x => x.HourlyRate).GreaterThan(0).When(x => x.HourlyRate.HasValue);
        RuleFor(x => x.ExperienceYears).GreaterThanOrEqualTo(0).When(x => x.ExperienceYears.HasValue);
        RuleFor(x => x.Subjects)
            .Must(x => x is { Count: > 0 })
            .WithMessage("At least one subject is required.");
        RuleForEach(x => x.Subjects).ChildRules(subject =>
        {
            subject.RuleFor(s => s.Name).NotEmpty().MaximumLength(100);
            subject.RuleFor(s => s.ProficiencyLevel).NotEmpty();
        });
    }
}
