using FluentAssertions;
using FluentValidation;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using TuitionHub.Application.Common.Interfaces;
using TuitionHub.Application.Features.Auth.Commands.Login;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.UnitTests;

public sealed class LoginHandlerTests
{
    private readonly IUserRepository _userRepo = Substitute.For<IUserRepository>();
    private readonly IRefreshTokenRepository _refreshRepo = Substitute.For<IRefreshTokenRepository>();
    private readonly IAuthService _authService = Substitute.For<IAuthService>();
    private readonly IJwtService _jwtService = Substitute.For<IJwtService>();
    private readonly LoginCommandHandler _sut;

    public LoginHandlerTests()
    {
        _sut = new LoginCommandHandler(_userRepo, _refreshRepo, _authService, _jwtService);
    }

    [Fact]
    public async Task Handle_ValidCredentials_ReturnsLoginResultWithTokens()
    {
        // Arrange
        var command = new LoginCommand(
            "user@example.com",
            "CorrectP@ss1",
            "Mozilla/5.0",
            "192.168.1.1");

        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "user@example.com",
            FullName = "Test User",
            PasswordHash = "hashed_correct_password",
            IsActive = true
        };

        _userRepo.GetByEmailAsync(command.Email, default)
            .Returns(Task.FromResult<User?>(existingUser));
        _authService.VerifyPassword(command.Password, existingUser.PasswordHash)
            .Returns(true);
        _jwtService.GenerateAccessToken(existingUser)
            .Returns("access_token_456");
        _authService.GenerateRefreshToken()
            .Returns("raw_refresh");
        _authService.HashToken("raw_refresh")
            .Returns("hashed_refresh");

        // Act
        var result = await _sut.Handle(command, default);

        // Assert
        result.Should().NotBeNull();
        result.UserId.Should().Be(existingUser.Id);
        result.Email.Should().Be("user@example.com");
        result.FullName.Should().Be("Test User");
        result.AccessToken.Should().Be("access_token_456");
        result.RefreshToken.Should().Be("raw_refresh");

        await _refreshRepo.Received(1).RevokeUserTokensAsync(existingUser.Id, default);
    }

    [Fact]
    public async Task Handle_UnknownEmail_ThrowsUnauthorized()
    {
        var command = new LoginCommand("unknown@email.com", "SomeP@ss1", null, null);
        _userRepo.GetByEmailAsync(command.Email, default)
            .Returns(Task.FromResult<User?>(null));

        var act = () => _sut.Handle(command, default);

        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Fact]
    public async Task Handle_WrongPassword_ThrowsUnauthorized()
    {
        var command = new LoginCommand("user@example.com", "WrongP@ss1", null, null);
        var user = new User { Id = Guid.NewGuid(), Email = "user@example.com", PasswordHash = "hash", IsActive = true };

        _userRepo.GetByEmailAsync(command.Email, default).Returns(Task.FromResult<User?>(user));
        _authService.VerifyPassword(command.Password, user.PasswordHash).Returns(false);

        var act = () => _sut.Handle(command, default);
        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Fact]
    public async Task Handle_InactiveUser_ThrowsUnauthorized()
    {
        var command = new LoginCommand("inactive@example.com", "SomeP@ss1", null, null);
        var user = new User { Id = Guid.NewGuid(), Email = "inactive@example.com", PasswordHash = "hash", IsActive = false };

        _userRepo.GetByEmailAsync(command.Email, default).Returns(Task.FromResult<User?>(user));
        _authService.VerifyPassword(command.Password, user.PasswordHash).Returns(true);

        var act = () => _sut.Handle(command, default);
        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Theory]
    [InlineData("", "SomeP@ss1")]
    [InlineData("not-email", "SomeP@ss1")]
    [InlineData("user@email.com", "")]
    public async Task Handle_InvalidCommand_FailsValidation(string email, string password)
    {
        var command = new LoginCommand(email, password, null, null);
        var validator = new LoginCommandValidator();

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
    }
}
