using MediatR;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Profiles.Commands.UpdateGuardianProfile;

public sealed class UpdateGuardianProfileCommandHandler(
    IGuardianProfileRepository guardianProfileRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateGuardianProfileCommand>
{
    public async Task Handle(UpdateGuardianProfileCommand command, CancellationToken ct)
    {
        var profile = await guardianProfileRepository.GetByUserIdAsync(command.UserId, ct);
        var isNew = profile is null;

        if (isNew)
        {
            profile = new GuardianProfile
            {
                Id = Guid.NewGuid(),
                UserId = command.UserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }

        profile.Bio = command.Bio;
        profile.Location = command.Location;
        profile.PreferredSubjects = command.PreferredSubjects ?? [];
        profile.ChildrenCount = command.ChildrenCount;
        profile.BudgetMin = command.BudgetMin;
        profile.BudgetMax = command.BudgetMax;
        profile.UpdatedAt = DateTime.UtcNow;

        if (isNew)
            await guardianProfileRepository.AddAsync(profile, ct);
        else
            guardianProfileRepository.Update(profile);

        await unitOfWork.SaveChangesAsync(ct);
    }
}
