using MediatR;
using TuitionHub.Domain.Enums;

namespace TuitionHub.Application.Features.Auth.Commands.Register;

public sealed record RegisterCommand(
    string Email,
    string Password,
    string FullName,
    string? Phone,
    UserRole Role = UserRole.Guardian,
    string? DeviceInfo = null,
    string? IpAddress = null) : IRequest<RegisterResult>;

public sealed record RegisterResult(
    Guid UserId,
    string Email,
    string FullName,
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt);
