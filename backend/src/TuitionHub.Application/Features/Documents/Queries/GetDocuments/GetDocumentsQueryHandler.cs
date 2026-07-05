using MediatR;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Documents.Queries.GetDocuments;

public sealed class GetDocumentsQueryHandler(IDocumentRepository documentRepository)
    : IRequestHandler<GetDocumentsQuery, List<DocumentDto>>
{
    public async Task<List<DocumentDto>> Handle(GetDocumentsQuery query, CancellationToken ct)
    {
        var docs = await documentRepository.GetByUserIdAsync(query.UserId, ct);
        return docs.Select(d => new DocumentDto(
            d.Id, d.Type.ToString(), d.FileName, d.FilePath,
            d.FileSize, d.ContentType, d.Status.ToString(),
            d.SubmittedAt, d.ReviewedAt, d.ReviewNotes
        )).ToList();
    }
}
