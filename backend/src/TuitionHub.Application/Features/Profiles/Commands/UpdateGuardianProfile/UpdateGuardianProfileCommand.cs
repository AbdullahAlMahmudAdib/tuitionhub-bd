using MediatR;

namespace TuitionHub.Application.Features.Profiles.Commands.UpdateGuardianProfile;

public record UpdateGuardianProfileCommand(
    Guid UserId,
    string? Bio,
    string? Location,
    List<string>? PreferredSubjects,
    int? ChildrenCount,
    decimal? BudgetMin,
    decimal? BudgetMax
) : IRequest;
