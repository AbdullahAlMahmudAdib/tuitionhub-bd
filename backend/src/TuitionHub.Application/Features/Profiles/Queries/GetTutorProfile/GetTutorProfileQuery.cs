using MediatR;

namespace TuitionHub.Application.Features.Profiles.Queries.GetTutorProfile;

public record GetTutorProfileQuery(Guid TutorUserId) : IRequest<TutorPublicProfileResult?>;

public record TutorPublicProfileResult(
    string FullName,
    string? Bio,
    decimal? HourlyRate,
    int? ExperienceYears,
    List<string>? PreferredAreas,
    List<string>? AvailableDays,
    List<TutorSubjectDto>? Subjects,
    List<QualificationDto>? Qualifications
);

public record TutorSubjectDto(string Name, string ProficiencyLevel, decimal? HourlyRate);
public record QualificationDto(string Degree, string Institution, string? Field, int? Year);
