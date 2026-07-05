using MediatR;

namespace TuitionHub.Application.Features.Profiles.Queries.GetProfile;

public record GetProfileQuery(Guid UserId) : IRequest<GetProfileResult?>;

public record GetProfileResult(
    Guid UserId,
    string Email,
    string FullName,
    string? Phone,
    string Role,
    string? Bio,
    // Tutor fields
    decimal? HourlyRate,
    int? ExperienceYears,
    List<string>? PreferredAreas,
    int? MaxTravelKm,
    List<string>? AvailableDays,
    List<TutorSubjectDto>? Subjects,
    List<QualificationDto>? Qualifications,
    // Guardian fields
    string? Location,
    List<string>? PreferredSubjects,
    int? ChildrenCount,
    decimal? BudgetMin,
    decimal? BudgetMax
);

public record TutorSubjectDto(string Name, string ProficiencyLevel, decimal? HourlyRate);
public record QualificationDto(string Degree, string Institution, string? Field, int? Year);
