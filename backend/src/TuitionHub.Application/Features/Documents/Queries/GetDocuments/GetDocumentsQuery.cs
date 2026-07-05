using MediatR;

namespace TuitionHub.Application.Features.Documents.Queries.GetDocuments;

public record GetDocumentsQuery(Guid UserId) : IRequest<List<DocumentDto>>;

public record DocumentDto(
    Guid Id,
    string Type,
    string FileName,
    string FilePath,
    long? FileSize,
    string ContentType,
    string Status,
    DateTime SubmittedAt,
    DateTime? ReviewedAt,
    string? ReviewNotes
);
