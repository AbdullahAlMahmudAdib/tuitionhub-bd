using FluentValidation;
using TuitionHub.Domain.Enums;

namespace TuitionHub.Application.Features.Documents.Commands.UploadDocument;

public sealed class UploadDocumentCommandValidator : AbstractValidator<UploadDocumentCommand>
{
    private static readonly HashSet<string> AllowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    public UploadDocumentCommandValidator()
    {
        RuleFor(x => x.Type).IsInEnum();
        RuleFor(x => x.ContentType).Must(x => AllowedTypes.Contains(x!))
            .WithMessage("Only JPG, PNG, and PDF files are allowed.");
        RuleFor(x => x.FileSize).LessThanOrEqualTo(5 * 1024 * 1024)
            .WithMessage("File size must not exceed 5 MB.");
        RuleFor(x => x.FileName).NotEmpty().MaximumLength(255);
    }
}
