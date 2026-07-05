using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionHub.Application.Features.Auth.Commands.Login;
using TuitionHub.Application.Features.Auth.Commands.RefreshTokenFlow;
using TuitionHub.Application.Features.Auth.Commands.Register;

namespace TuitionHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController(ISender sender) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IResult> Register(
        RegisterCommand command,
        CancellationToken ct)
    {
        try
        {
            var result = await sender.Send(command, ct);
            return Results.Created($"/api/users/{result.UserId}", result);
        }
        catch (InvalidOperationException ex)
        {
            return Results.Conflict(new { error = ex.Message });
        }
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IResult> Login(
        LoginCommand command,
        CancellationToken ct)
    {
        try
        {
            var result = await sender.Send(command, ct);
            return Results.Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Results.Unauthorized();
        }
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IResult> Refresh(
        RefreshTokenCommand command,
        CancellationToken ct)
    {
        try
        {
            var result = await sender.Send(command, ct);
            return Results.Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Results.Unauthorized();
        }
    }
}
