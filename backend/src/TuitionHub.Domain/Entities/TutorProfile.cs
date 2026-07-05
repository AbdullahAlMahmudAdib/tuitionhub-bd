namespace TuitionHub.Domain.Entities;

public class TutorProfile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string? Bio { get; set; }
    public decimal? HourlyRate { get; set; }
    public int? ExperienceYears { get; set; }
    public List<string> PreferredAreas { get; set; } = [];
    public int? MaxTravelKm { get; set; }
    public List<string> AvailableDays { get; set; } = [];
    public ICollection<TutorSubject> Subjects { get; set; } = [];
    public ICollection<TutorQualification> Qualifications { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
