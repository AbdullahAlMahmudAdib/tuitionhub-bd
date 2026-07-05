using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionHub.Application.Features.Verification.Commands.RequestOtp;
using TuitionHub.Application.Features.Verification.Commands.VerifyOtp;

namespace TuitionHub.Api.Controllers;

[ApiController]
[Route("api/otp")]
[Authorize]
public class OtpController(ISender mediator) : ControllerBase
{
    [HttpPost("request")]
    public async Task<IActionResult> RequestOtp([FromBody] RequestOtpBody body, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await mediator.Send(new RequestOtpCommand(userId, body.Phone), ct);
        return Ok(new { message = "OTP sent." });
    }

    [HttpPost("verify")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpBody body, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await mediator.Send(new VerifyOtpCommand(userId, body.Code), ct);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    public record RequestOtpBody(string Phone);
    public record VerifyOtpBody(string Code);
}
