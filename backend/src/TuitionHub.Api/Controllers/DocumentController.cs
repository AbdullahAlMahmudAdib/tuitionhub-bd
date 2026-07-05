using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionHub.Application.Features.Documents.Commands.DeleteDocument;
using TuitionHub.Application.Features.Documents.Commands.UploadDocument;
using TuitionHub.Application.Features.Documents.Queries.GetDocuments;
using TuitionHub.Domain.Enums;

namespace TuitionHub.Api.Controllers;

[ApiController]
[Route("api/documents")]
[Authorize]
public class DocumentController(ISender mediator) : ControllerBase
{
    [HttpPost]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> Upload(IFormFile file, [FromForm] string type, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        if (!Enum.TryParse<DocumentType>(type, true, out var docType))
            return BadRequest("Invalid document type.");

        var cmd = new UploadDocumentCommand(
            userId, docType, file.FileName, file.ContentType, file.Length, file.OpenReadStream());
        var result = await mediator.Send(cmd, ct);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetDocuments(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await mediator.Send(new GetDocumentsQuery(userId), ct);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await mediator.Send(new DeleteDocumentCommand(userId, id), ct);
        return Ok(new { message = "Document deleted." });
    }
}
