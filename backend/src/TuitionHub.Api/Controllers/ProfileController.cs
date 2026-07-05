using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionHub.Application.Features.Profiles.Commands.UpdateGuardianProfile;
using TuitionHub.Application.Features.Profiles.Commands.UpdateTutorProfile;
using TuitionHub.Application.Features.Profiles.Queries.GetProfile;
using TuitionHub.Application.Features.Profiles.Queries.GetTutorProfile;

namespace TuitionHub.Api.Controllers;

[ApiController]
[Route("api")]
public class ProfileController(ISender mediator) : ControllerBase
{
    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await mediator.Send(new GetProfileQuery(userId), ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role);

        if (role == "Tutor")
        {
            var cmd = await Request.ReadFromJsonAsync<UpdateTutorProfileCommand>(ct);
            if (cmd is null) return BadRequest();
            await mediator.Send(cmd with { UserId = userId }, ct);
        }
        else
        {
            var cmd = await Request.ReadFromJsonAsync<UpdateGuardianProfileCommand>(ct);
            if (cmd is null) return BadRequest();
            await mediator.Send(cmd with { UserId = userId }, ct);
        }

        return Ok(new { message = "Profile updated." });
    }

    [HttpGet("tutors/{id:guid}")]
    public async Task<IActionResult> GetTutorPublic(Guid id, CancellationToken ct)
    {
        var result = await mediator.Send(new GetTutorProfileQuery(id), ct);
        return result is null ? NotFound() : Ok(result);
    }
}
