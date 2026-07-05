using FluentAssertions;
using FluentValidation;
using NSubstitute;
using TuitionHub.Application.Common.Interfaces;
using TuitionHub.Application.Features.Auth.Commands.Register;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.UnitTests;

public sealed class RegisterHandlerTests
{
    private readonly IUserRepository _userRepo = Substitute.For<IUserRepository>();
    private readonly IRefreshTokenRepository _refreshRepo = Substitute.For<IRefreshTokenRepository>();
    private readonly IAuthService _authService = Substitute.For<IAuthService>();
    private readonly IJwtService _jwtService = Substitute.For<IJwtService>();
    private readonly RegisterCommandHandler _sut;

    public RegisterHandlerTests()
    {
        _sut = new RegisterCommandHandler(_userRepo, _refreshRepo, _authService, _jwtService);
    }

    [Fact]
    public async Task Handle_ValidCommand_ReturnsRegisterResultWithTokens()
    {
        // Arrange
        var command = new RegisterCommand(
            "newuser@example.com",
            "StrongP@ss1",
            "New User",
            "+8801712345678",
            "Mozilla/5.0",
            "192.168.1.1");

        _userRepo.EmailExistsAsync(command.Email, default)
            .Returns(Task.FromResult(false));

        _authService.HashPassword(command.Password)
            .Returns("hashed_password_123");

        _jwtService.GenerateAccessToken(Arg.Any<User>())
            .Returns("access_token_123");

        _authService.GenerateRefreshToken()
            .Returns("raw_refresh_token");
        _authService.HashToken("raw_refresh_token")
            .Returns("hashed_refresh_token");

        // Act
        var result = await _sut.Handle(command, default);

        // Assert
        result.Should().NotBeNull();
        result.UserId.Should().NotBeEmpty();
        result.Email.Should().Be("newuser@example.com");
        result.FullName.Should().Be("New User");
        result.AccessToken.Should().Be("access_token_123");
        result.RefreshToken.Should().Be("raw_refresh_token");
        result.ExpiresAt.Should().BeCloseTo(DateTime.UtcNow.AddDays(7), TimeSpan.FromSeconds(5));

        await _userRepo.Received(1).AddAsync(Arg.Is<User>(u =>
            u.Email == "newuser@example.com" &&
            u.FullName == "New User" &&
            u.PasswordHash == "hashed_password_123"));

        await _refreshRepo.Received(1).AddAsync(Arg.Is<RefreshToken>(t =>
            t.TokenHash == "hashed_refresh_token"));
    }

    [Fact]
    public async Task Handle_DuplicateEmail_ThrowsInvalidOperationException()
    {
        // Arrange
        var command = new RegisterCommand(
            "existing@example.com",
            "StrongP@ss1",
            "Existing User",
            null, null, null);

        _userRepo.EmailExistsAsync(command.Email, default)
            .Returns(Task.FromResult(true));

        // Act
        var act = () => _sut.Handle(command, default);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Email is already registered.");
    }

    [Theory]
    [InlineData("", "StrongP@ss1", "Name")]       // empty email
    [InlineData("not-an-email", "StrongP@ss1", "Name")]  // invalid email
    [InlineData("valid@email.com", "short", "Name")]     // too-short password
    [InlineData("valid@email.com", "nouppercase1", "Name")]     // no uppercase
    [InlineData("valid@email.com", "NOLOWERCASE1", "Name")]     // no lowercase
    [InlineData("valid@email.com", "NoDigitPass", "Name")]      // no digit
    [InlineData("valid@email.com", "ValidP@ss1", "")]           // empty name
    [InlineData("valid@email.com", "ValidP@ss1", "A")]          // too-short name
    public async Task Handle_InvalidCommand_ThrowsValidationException(
        string email, string password, string fullName)
    {
        // Arrange
        var command = new RegisterCommand(email, password, fullName, null, null, null);
        var validator = new RegisterCommandValidator();

        // Act
        var result = await validator.ValidateAsync(command);

        // Assert
        result.IsValid.Should().BeFalse();
    }
}
