using System.Security.Claims;
using MediatR;
using TuitionHub.Application.Common.Interfaces;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Auth.Commands.RefreshTokenFlow;

public sealed class RefreshTokenCommandHandler(
    IUserRepository userRepository,
    IRefreshTokenRepository refreshTokenRepository,
    IAuthService authService,
    IJwtService jwtService)
    : IRequestHandler<RefreshTokenCommand, RefreshTokenResult>
{
    public async Task<RefreshTokenResult> Handle(RefreshTokenCommand command, CancellationToken ct)
    {
        // Validate access token (may be expired — we just need the claims)
        var principal = jwtService.ValidateToken(command.AccessToken);
        if (principal is null)
            throw new UnauthorizedAccessException("Invalid access token.");

        var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
            throw new UnauthorizedAccessException("Invalid access token.");

        // Validate refresh token
        var tokenHash = authService.HashToken(command.RefreshToken);
        var storedToken = await refreshTokenRepository.GetByTokenHashAsync(tokenHash, ct);
        if (storedToken is null || !storedToken.IsActive)
            throw new UnauthorizedAccessException("Invalid or expired refresh token.");

        // Load user
        var user = await userRepository.GetByIdAsync(userId, ct);
        if (user is null || !user.IsActive)
            throw new UnauthorizedAccessException("User not found or inactive.");

        // Revoke old refresh token (token rotation)
        await refreshTokenRepository.RevokeUserTokensAsync(userId, ct);

        // Issue new token pair
        var accessToken = jwtService.GenerateAccessToken(user);
        var refreshToken = authService.GenerateRefreshToken();
        var newTokenHash = authService.HashToken(refreshToken);

        var tokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TokenHash = newTokenHash,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        };

        await refreshTokenRepository.AddAsync(tokenEntity, ct);

        return new RefreshTokenResult(userId, accessToken, refreshToken, tokenEntity.ExpiresAt);
    }
}
