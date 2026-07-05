using Microsoft.EntityFrameworkCore;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Enums;

namespace TuitionHub.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<OtpCode> OtpCodes => Set<OtpCode>();
    public DbSet<TutorProfile> TutorProfiles => Set<TutorProfile>();
    public DbSet<TutorSubject> TutorSubjects => Set<TutorSubject>();
    public DbSet<TutorQualification> TutorQualifications => Set<TutorQualification>();
    public DbSet<GuardianProfile> GuardianProfiles => Set<GuardianProfile>();
    public DbSet<Document> Documents => Set<Document>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.HasPostgresExtension("pgcrypto");
        builder.HasPostgresExtension("pg_trgm");
        builder.HasPostgresEnum<UserRole>("user_role");
        builder.HasPostgresEnum<OtpType>("otp_type");
        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        foreach (var entry in ChangeTracker.Entries<User>())
        {
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
        foreach (var entry in ChangeTracker.Entries<TutorProfile>())
        {
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
        foreach (var entry in ChangeTracker.Entries<GuardianProfile>())
        {
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
        return await base.SaveChangesAsync(ct);
    }
}
