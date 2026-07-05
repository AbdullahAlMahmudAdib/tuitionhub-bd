namespace TuitionHub.Domain.Entities;

public class GuardianProfile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string? Bio { get; set; }
    public string? Location { get; set; }
    public List<string> PreferredSubjects { get; set; } = [];
    public int? ChildrenCount { get; set; }
    public decimal? BudgetMin { get; set; }
    public decimal? BudgetMax { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
