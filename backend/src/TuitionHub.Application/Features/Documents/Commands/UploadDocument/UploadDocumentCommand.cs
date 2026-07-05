using MediatR;
using TuitionHub.Domain.Enums;

namespace TuitionHub.Application.Features.Documents.Commands.UploadDocument;

public record UploadDocumentCommand(
    Guid UserId,
    DocumentType Type,
    string FileName,
    string ContentType,
    long FileSize,
    Stream FileStream
) : IRequest<UploadDocumentResult>;

public record UploadDocumentResult(Guid Id, string FilePath);
