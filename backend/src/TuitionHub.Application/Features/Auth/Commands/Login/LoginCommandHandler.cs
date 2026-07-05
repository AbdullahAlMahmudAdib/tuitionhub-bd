using MediatR;
using TuitionHub.Application.Common.Interfaces;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Auth.Commands.Login;

public sealed class LoginCommandHandler(
    IUserRepository userRepository,
    IRefreshTokenRepository refreshTokenRepository,
    IAuthService authService,
    IJwtService jwtService)
    : IRequestHandler<LoginCommand, LoginResult>
{
    public async Task<LoginResult> Handle(LoginCommand command, CancellationToken ct)
    {
        var user = await userRepository.GetByEmailAsync(command.Email, ct);
        if (user is null || !user.IsActive)
            throw new UnauthorizedAccessException("Invalid credentials.");

        if (!authService.VerifyPassword(command.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");

        // Revoke old refresh tokens (token rotation)
        await refreshTokenRepository.RevokeUserTokensAsync(user.Id, ct);

        var accessToken = jwtService.GenerateAccessToken(user);
        var refreshToken = authService.GenerateRefreshToken();
        var tokenHash = authService.HashToken(refreshToken);

        var tokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = tokenHash,
            DeviceInfo = command.DeviceInfo,
            IpAddress = command.IpAddress,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        };

        await refreshTokenRepository.AddAsync(tokenEntity, ct);

        return new LoginResult(
            user.Id,
            user.Email,
            user.FullName,
            accessToken,
            refreshToken,
            tokenEntity.ExpiresAt);
    }
}
