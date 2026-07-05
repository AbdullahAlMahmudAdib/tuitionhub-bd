using MediatR;

namespace TuitionHub.Application.Features.Documents.Commands.DeleteDocument;

public record DeleteDocumentCommand(Guid UserId, Guid DocumentId) : IRequest;
