using MediatR;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Enums;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Documents.Commands.UploadDocument;

public sealed class UploadDocumentCommandHandler(
    IDocumentRepository documentRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<UploadDocumentCommand, UploadDocumentResult>
{
    private const string UploadDir = "uploads";

    public async Task<UploadDocumentResult> Handle(UploadDocumentCommand command, CancellationToken ct)
    {
        var userDir = Path.Combine(UploadDir, command.UserId.ToString());
        Directory.CreateDirectory(userDir);

        var uniqueName = $"{Guid.NewGuid()}_{command.FileName}";
        var filePath = Path.Combine(userDir, uniqueName);

        await using var fileStream = new FileStream(filePath, FileMode.Create);
        await command.FileStream.CopyToAsync(fileStream, ct);

        var document = new Document
        {
            Id = Guid.NewGuid(),
            UserId = command.UserId,
            Type = command.Type,
            FilePath = filePath,
            FileName = command.FileName,
            FileSize = command.FileSize,
            ContentType = command.ContentType,
            Status = VerificationStatus.Pending,
            SubmittedAt = DateTime.UtcNow
        };

        await documentRepository.AddAsync(document, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return new UploadDocumentResult(document.Id, $"/{filePath}");
    }
}
