using TuitionHub.Domain.Enums;

namespace TuitionHub.Domain.Entities;

public class Document
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public DocumentType Type { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public long? FileSize { get; set; }
    public string? ContentType { get; set; }
    public VerificationStatus Status { get; set; } = VerificationStatus.Pending;
    public Guid? ReviewerId { get; set; }
    public User? Reviewer { get; set; }
    public string? ReviewNotes { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReviewedAt { get; set; }
}
