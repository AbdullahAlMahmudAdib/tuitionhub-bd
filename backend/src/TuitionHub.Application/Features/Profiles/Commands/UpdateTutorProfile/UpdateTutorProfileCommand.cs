using MediatR;

namespace TuitionHub.Application.Features.Profiles.Commands.UpdateTutorProfile;

public record UpdateTutorProfileCommand(
    Guid UserId,
    string? Bio,
    decimal? HourlyRate,
    int? ExperienceYears,
    List<string>? PreferredAreas,
    int? MaxTravelKm,
    List<string>? AvailableDays,
    List<SubjectInput>? Subjects,
    List<QualificationInput>? Qualifications
) : IRequest;

public record SubjectInput(string Name, string ProficiencyLevel, decimal? HourlyRate);
public record QualificationInput(string Degree, string Institution, string? Field, int? Year);
