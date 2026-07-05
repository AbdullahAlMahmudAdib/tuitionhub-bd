using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionHub.Domain.Entities;

namespace TuitionHub.Infrastructure.Persistence.Configurations;

public class GuardianProfileConfiguration : IEntityTypeConfiguration<GuardianProfile>
{
    public void Configure(EntityTypeBuilder<GuardianProfile> builder)
    {
        builder.ToTable("guardian_profiles");
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => x.UserId).IsUnique();
        builder.Property(x => x.Bio).HasMaxLength(1000);
        builder.Property(x => x.Location).HasMaxLength(300);
        builder.Property(x => x.PreferredSubjects).HasColumnType("text[]");
        builder.Property(x => x.BudgetMin).HasPrecision(10, 2);
        builder.Property(x => x.BudgetMax).HasPrecision(10, 2);
        builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}
