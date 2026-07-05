using MediatR;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Enums;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Profiles.Queries.GetProfile;

public sealed class GetProfileQueryHandler(
    IUserRepository userRepository,
    ITutorProfileRepository tutorProfileRepository,
    IGuardianProfileRepository guardianProfileRepository)
    : IRequestHandler<GetProfileQuery, GetProfileResult?>
{
    public async Task<GetProfileResult?> Handle(GetProfileQuery query, CancellationToken ct)
    {
        var user = await userRepository.GetByIdAsync(query.UserId, ct);
        if (user is null) return null;

        return user.Role switch
        {
            UserRole.Tutor => await BuildTutorResult(user, ct),
            UserRole.Guardian => await BuildGuardianResult(user, ct),
            _ => BuildBasicResult(user)
        };
    }

    private async Task<GetProfileResult> BuildTutorResult(User user, CancellationToken ct)
    {
        var profile = await tutorProfileRepository.GetByUserIdAsync(user.Id, ct);
        return new GetProfileResult(
            user.Id, user.Email, user.FullName, user.Phone, user.Role.ToString(),
            profile?.Bio,
            profile?.HourlyRate,
            profile?.ExperienceYears,
            profile?.PreferredAreas,
            profile?.MaxTravelKm,
            profile?.AvailableDays,
            profile?.Subjects?.Select(s => new TutorSubjectDto(s.Name, s.ProficiencyLevel.ToString(), s.HourlyRate)).ToList(),
            profile?.Qualifications?.Select(q => new QualificationDto(q.Degree, q.Institution, q.Field, q.Year)).ToList(),
            null, null, null, null, null
        );
    }

    private async Task<GetProfileResult> BuildGuardianResult(User user, CancellationToken ct)
    {
        var profile = await guardianProfileRepository.GetByUserIdAsync(user.Id, ct);
        return new GetProfileResult(
            user.Id, user.Email, user.FullName, user.Phone, user.Role.ToString(),
            profile?.Bio,
            null, null, null, null, null, null, null,
            profile?.Location,
            profile?.PreferredSubjects,
            profile?.ChildrenCount,
            profile?.BudgetMin,
            profile?.BudgetMax
        );
    }

    private static GetProfileResult BuildBasicResult(User user) =>
        new(user.Id, user.Email, user.FullName, user.Phone, user.Role.ToString(), null,
            null, null, null, null, null, null, null, null, null, null, null, null);
}
