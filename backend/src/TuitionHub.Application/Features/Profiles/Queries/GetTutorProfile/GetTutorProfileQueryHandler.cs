using MediatR;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Profiles.Queries.GetTutorProfile;

public sealed class GetTutorProfileQueryHandler(
    IUserRepository userRepository,
    ITutorProfileRepository tutorProfileRepository)
    : IRequestHandler<GetTutorProfileQuery, TutorPublicProfileResult?>
{
    public async Task<TutorPublicProfileResult?> Handle(GetTutorProfileQuery query, CancellationToken ct)
    {
        var user = await userRepository.GetByIdAsync(query.TutorUserId, ct);
        if (user is null) return null;

        var profile = await tutorProfileRepository.GetByUserIdAsync(query.TutorUserId, ct);

        return new TutorPublicProfileResult(
            user.FullName,
            profile?.Bio,
            profile?.HourlyRate,
            profile?.ExperienceYears,
            profile?.PreferredAreas,
            profile?.AvailableDays,
            profile?.Subjects?.Select(s => new TutorSubjectDto(s.Name, s.ProficiencyLevel.ToString(), s.HourlyRate)).ToList(),
            profile?.Qualifications?.Select(q => new QualificationDto(q.Degree, q.Institution, q.Field, q.Year)).ToList()
        );
    }
}
