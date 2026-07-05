using MediatR;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Enums;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Profiles.Commands.UpdateTutorProfile;

public sealed class UpdateTutorProfileCommandHandler(
    ITutorProfileRepository tutorProfileRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateTutorProfileCommand>
{
    public async Task Handle(UpdateTutorProfileCommand command, CancellationToken ct)
    {
        var profile = await tutorProfileRepository.GetByUserIdAsync(command.UserId, ct);
        var isNew = profile is null;

        if (isNew)
        {
            profile = new TutorProfile
            {
                Id = Guid.NewGuid(),
                UserId = command.UserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }

        profile.Bio = command.Bio;
        profile.HourlyRate = command.HourlyRate;
        profile.ExperienceYears = command.ExperienceYears;
        profile.PreferredAreas = command.PreferredAreas ?? [];
        profile.MaxTravelKm = command.MaxTravelKm;
        profile.AvailableDays = command.AvailableDays ?? [];

        // Replace subjects
        if (command.Subjects is not null)
        {
            profile.Subjects.Clear();
            foreach (var s in command.Subjects)
            {
                profile.Subjects.Add(new TutorSubject
                {
                    Id = Guid.NewGuid(),
                    TutorProfileId = profile.Id,
                    Name = s.Name,
                    ProficiencyLevel = Enum.Parse<ProficiencyLevel>(s.ProficiencyLevel),
                    HourlyRate = s.HourlyRate,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        // Replace qualifications
        if (command.Qualifications is not null)
        {
            profile.Qualifications.Clear();
            foreach (var q in command.Qualifications)
            {
                profile.Qualifications.Add(new TutorQualification
                {
                    Id = Guid.NewGuid(),
                    TutorProfileId = profile.Id,
                    Degree = q.Degree,
                    Institution = q.Institution,
                    Field = q.Field,
                    Year = q.Year,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        profile.UpdatedAt = DateTime.UtcNow;

        if (isNew)
            await tutorProfileRepository.AddAsync(profile, ct);
        else
            tutorProfileRepository.Update(profile);

        await unitOfWork.SaveChangesAsync(ct);
    }
}
