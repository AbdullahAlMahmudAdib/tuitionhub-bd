using MediatR;

namespace TuitionHub.Application.Features.Auth.Commands.Register;

public sealed record RegisterCommand(
    string Email,
    string Password,
    string FullName,
    string? Phone,
    string? DeviceInfo,
    string? IpAddress) : IRequest<RegisterResult>;

public sealed record RegisterResult(
    Guid UserId,
    string Email,
    string FullName,
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt);
