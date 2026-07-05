using System.Security.Claims;
using FluentAssertions;
using FluentValidation;
using NSubstitute;
using TuitionHub.Application.Common.Interfaces;
using TuitionHub.Application.Features.Auth.Commands.RefreshTokenFlow;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.UnitTests;

public sealed class RefreshTokenHandlerTests
{
    private readonly IRefreshTokenRepository _refreshRepo = Substitute.For<IRefreshTokenRepository>();
    private readonly IUserRepository _userRepo = Substitute.For<IUserRepository>();
    private readonly IAuthService _authService = Substitute.For<IAuthService>();
    private readonly IJwtService _jwtService = Substitute.For<IJwtService>();
    private readonly RefreshTokenCommandHandler _sut;

    public RefreshTokenHandlerTests()
    {
        _sut = new RefreshTokenCommandHandler(_userRepo, _refreshRepo, _authService, _jwtService);
    }

    [Fact]
    public async Task Handle_ValidTokens_ReturnsNewTokenPair()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var command = new RefreshTokenCommand("expired_access_token", "valid_refresh_token");

        var user = new User
        {
            Id = userId,
            Email = "user@example.com",
            FullName = "Test User",
            IsActive = true
        };

        var storedToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TokenHash = "hashed_refresh",
            ExpiresAt = DateTime.UtcNow.AddDays(1),
            IsRevoked = false,
            CreatedAt = DateTime.UtcNow.AddDays(-2)
        };

        var principal = new ClaimsPrincipal(new ClaimsIdentity([
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        ]));

        _jwtService.ValidateToken(command.AccessToken).Returns(principal);
        _authService.HashToken(command.RefreshToken).Returns("hashed_refresh");
        _refreshRepo.GetByTokenHashAsync("hashed_refresh", default)
            .Returns(Task.FromResult<RefreshToken?>(storedToken));
        _userRepo.GetByIdAsync(userId, default).Returns(Task.FromResult<User?>(user));
        _jwtService.GenerateAccessToken(user).Returns("new_access_token");
        _authService.GenerateRefreshToken().Returns("new_refresh_raw");
        _authService.HashToken("new_refresh_raw").Returns("new_hashed_refresh");

        // Act
        var result = await _sut.Handle(command, default);

        // Assert
        result.Should().NotBeNull();
        result.AccessToken.Should().Be("new_access_token");
        result.RefreshToken.Should().Be("new_refresh_raw");

        await _refreshRepo.Received(1).RevokeUserTokensAsync(userId, default);
    }

    [Fact]
    public async Task Handle_RevokedToken_ThrowsUnauthorized()
    {
        var command = new RefreshTokenCommand("access", "revoked_refresh");
        var storedToken = new RefreshToken
        {
            TokenHash = "hashed_revoked",
            IsRevoked = true,
            ExpiresAt = DateTime.UtcNow.AddDays(1)
        };

        _jwtService.ValidateToken(command.AccessToken)
            .Returns(new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())])));
        _authService.HashToken(command.RefreshToken).Returns("hashed_revoked");
        _refreshRepo.GetByTokenHashAsync("hashed_revoked", default)
            .Returns(Task.FromResult<RefreshToken?>(storedToken));

        var act = () => _sut.Handle(command, default);
        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Fact]
    public async Task Handle_ExpiredRefreshToken_ThrowsUnauthorized()
    {
        var command = new RefreshTokenCommand("access", "expired_refresh");
        var storedToken = new RefreshToken
        {
            TokenHash = "hashed_expired",
            IsRevoked = false,
            ExpiresAt = DateTime.UtcNow.AddDays(-1)
        };

        _jwtService.ValidateToken(command.AccessToken)
            .Returns(new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())])));
        _authService.HashToken(command.RefreshToken).Returns("hashed_expired");
        _refreshRepo.GetByTokenHashAsync("hashed_expired", default)
            .Returns(Task.FromResult<RefreshToken?>(storedToken));

        var act = () => _sut.Handle(command, default);
        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Fact]
    public async Task Handle_InvalidAccessToken_ThrowsUnauthorized()
    {
        var command = new RefreshTokenCommand("invalid_access", "refresh");
        _jwtService.ValidateToken(command.AccessToken).Returns((ClaimsPrincipal?)null);

        var act = () => _sut.Handle(command, default);
        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Theory]
    [InlineData("", "refresh")]
    [InlineData("access", "")]
    public async Task Handle_EmptyTokens_FailsValidation(string access, string refresh)
    {
        var command = new RefreshTokenCommand(access, refresh);
        var validator = new RefreshTokenCommandValidator();

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
    }
}
