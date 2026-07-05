using MediatR;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Documents.Commands.DeleteDocument;

public sealed class DeleteDocumentCommandHandler(
    IDocumentRepository documentRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<DeleteDocumentCommand>
{
    public async Task Handle(DeleteDocumentCommand command, CancellationToken ct)
    {
        var doc = await documentRepository.GetByIdAsync(command.DocumentId, ct)
            ?? throw new InvalidOperationException("Document not found.");

        if (doc.UserId != command.UserId)
            throw new UnauthorizedAccessException("You can only delete your own documents.");

        if (System.IO.File.Exists(doc.FilePath))
            System.IO.File.Delete(doc.FilePath);

        documentRepository.Delete(doc);
        await unitOfWork.SaveChangesAsync(ct);
    }
}
