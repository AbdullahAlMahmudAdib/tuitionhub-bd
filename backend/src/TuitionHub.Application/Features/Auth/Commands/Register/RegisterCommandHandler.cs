using MediatR;
using TuitionHub.Application.Common.Interfaces;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Enums;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Auth.Commands.Register;

public sealed class RegisterCommandHandler(
    IUserRepository userRepository,
    IRefreshTokenRepository refreshTokenRepository,
    IAuthService authService,
    IJwtService jwtService)
    : IRequestHandler<RegisterCommand, RegisterResult>
{
    public async Task<RegisterResult> Handle(RegisterCommand command, CancellationToken ct)
    {
        if (await userRepository.EmailExistsAsync(command.Email, ct))
            throw new InvalidOperationException("Email is already registered.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = command.Email.ToLowerInvariant().Trim(),
            FullName = command.FullName.Trim(),
            Phone = command.Phone?.Trim(),
            PasswordHash = authService.HashPassword(command.Password),
            Role = UserRole.Guardian,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await userRepository.AddAsync(user, ct);

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

        return new RegisterResult(
            user.Id,
            user.Email,
            user.FullName,
            accessToken,
            refreshToken,
            tokenEntity.ExpiresAt);
    }
}
