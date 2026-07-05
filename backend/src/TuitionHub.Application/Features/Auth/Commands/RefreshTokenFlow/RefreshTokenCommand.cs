using MediatR;

namespace TuitionHub.Application.Features.Auth.Commands.RefreshTokenFlow;

public sealed record RefreshTokenCommand(
    string AccessToken,
    string RefreshToken) : IRequest<RefreshTokenResult>;

public sealed record RefreshTokenResult(
    Guid UserId,
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt);
