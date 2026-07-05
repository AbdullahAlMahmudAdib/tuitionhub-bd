using TuitionHub.Domain.Enums;

namespace TuitionHub.Domain.Entities;

public class TutorSubject
{
    public Guid Id { get; set; }
    public Guid TutorProfileId { get; set; }
    public TutorProfile TutorProfile { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public ProficiencyLevel ProficiencyLevel { get; set; }
    public decimal? HourlyRate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
