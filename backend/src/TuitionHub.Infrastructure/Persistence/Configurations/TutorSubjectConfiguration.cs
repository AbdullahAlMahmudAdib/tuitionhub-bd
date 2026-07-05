using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionHub.Domain.Entities;

namespace TuitionHub.Infrastructure.Persistence.Configurations;

public class TutorSubjectConfiguration : IEntityTypeConfiguration<TutorSubject>
{
    public void Configure(EntityTypeBuilder<TutorSubject> builder)
    {
        builder.ToTable("tutor_subjects");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).HasMaxLength(100).IsRequired();
        builder.Property(x => x.ProficiencyLevel).HasConversion<string>().HasMaxLength(20);
        builder.Property(x => x.HourlyRate).HasPrecision(10, 2);
        builder.HasOne(x => x.TutorProfile).WithMany(x => x.Subjects).HasForeignKey(x => x.TutorProfileId).OnDelete(DeleteBehavior.Cascade);
    }
}
