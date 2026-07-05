using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionHub.Application.Features.Verification.Commands.ApproveProfile;
using TuitionHub.Application.Features.Verification.Commands.RejectProfile;
using TuitionHub.Application.Features.Verification.Commands.SubmitForVerification;
using TuitionHub.Application.Features.Verification.Queries.GetPendingVerifications;

namespace TuitionHub.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class VerificationController(ISender mediator) : ControllerBase
{
    [HttpPost("verification/submit")]
    public async Task<IActionResult> Submit(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await mediator.Send(new SubmitForVerificationCommand(userId), ct);
        return Ok(new { message = "Profile submitted for verification." });
    }

    [HttpGet("admin/verifications")]
    [Authorize(Roles = "SubAdmin,SuperAdmin")]
    public async Task<IActionResult> GetPending(CancellationToken ct)
    {
        var result = await mediator.Send(new GetPendingVerificationsQuery(), ct);
        return Ok(result);
    }

    [HttpPost("admin/verifications/{id:guid}/approve")]
    [Authorize(Roles = "SubAdmin,SuperAdmin")]
    public async Task<IActionResult> Approve(Guid id, CancellationToken ct)
    {
        var adminId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await mediator.Send(new ApproveProfileCommand(adminId, id), ct);
        return Ok(new { message = "Profile approved." });
    }

    [HttpPost("admin/verifications/{id:guid}/reject")]
    [Authorize(Roles = "SubAdmin,SuperAdmin")]
    public async Task<IActionResult> Reject(Guid id, [FromBody] RejectBody body, CancellationToken ct)
    {
        var adminId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await mediator.Send(new RejectProfileCommand(adminId, id, body.Reason), ct);
        return Ok(new { message = "Profile rejected." });
    }

    public record RejectBody(string Reason);
}
