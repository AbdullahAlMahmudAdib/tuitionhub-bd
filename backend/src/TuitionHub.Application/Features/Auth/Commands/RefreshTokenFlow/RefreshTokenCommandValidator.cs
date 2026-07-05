using FluentValidation;

namespace TuitionHub.Application.Features.Auth.Commands.RefreshTokenFlow;

public sealed class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.AccessToken).NotEmpty().WithMessage("Access token is required");
        RuleFor(x => x.RefreshToken).NotEmpty().WithMessage("Refresh token is required");
    }
}
