namespace TuitionHub.Domain.Entities;

public class TutorQualification
{
    public Guid Id { get; set; }
    public Guid TutorProfileId { get; set; }
    public TutorProfile TutorProfile { get; set; } = null!;
    public string Degree { get; set; } = string.Empty;
    public string Institution { get; set; } = string.Empty;
    public string? Field { get; set; }
    public int? Year { get; set; }
    public Guid? DocumentId { get; set; }
    public Document? Document { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
