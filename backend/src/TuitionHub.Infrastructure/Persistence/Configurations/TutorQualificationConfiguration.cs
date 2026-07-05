using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionHub.Domain.Entities;

namespace TuitionHub.Infrastructure.Persistence.Configurations;

public class TutorQualificationConfiguration : IEntityTypeConfiguration<TutorQualification>
{
    public void Configure(EntityTypeBuilder<TutorQualification> builder)
    {
        builder.ToTable("tutor_qualifications");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Degree).HasMaxLength(150).IsRequired();
        builder.Property(x => x.Institution).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Field).HasMaxLength(150);
        builder.HasOne(x => x.TutorProfile).WithMany(x => x.Qualifications).HasForeignKey(x => x.TutorProfileId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.Document).WithMany().HasForeignKey(x => x.DocumentId).OnDelete(DeleteBehavior.SetNull);
    }
}
