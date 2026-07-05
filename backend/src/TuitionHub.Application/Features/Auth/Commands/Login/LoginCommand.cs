using MediatR;

namespace TuitionHub.Application.Features.Auth.Commands.Login;

public sealed record LoginCommand(
    string Email,
    string Password,
    string? DeviceInfo,
    string? IpAddress) : IRequest<LoginResult>;

public sealed record LoginResult(
    Guid UserId,
    string Email,
    string FullName,
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt);
