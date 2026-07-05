using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionHub.Domain.Entities;

namespace TuitionHub.Infrastructure.Persistence.Configurations;

public class TutorProfileConfiguration : IEntityTypeConfiguration<TutorProfile>
{
    public void Configure(EntityTypeBuilder<TutorProfile> builder)
    {
        builder.ToTable("tutor_profiles");
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => x.UserId).IsUnique();
        builder.Property(x => x.Bio).HasMaxLength(1000);
        builder.Property(x => x.HourlyRate).HasPrecision(10, 2);
        builder.Property(x => x.PreferredAreas).HasColumnType("text[]");
        builder.Property(x => x.AvailableDays).HasColumnType("text[]");
        builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}
