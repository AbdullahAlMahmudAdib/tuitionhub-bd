using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionHub.Domain.Entities;

namespace TuitionHub.Infrastructure.Persistence.Configurations;

public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.ToTable("documents");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Type).HasConversion<string>().HasMaxLength(20);
        builder.Property(x => x.FilePath).HasMaxLength(500).IsRequired();
        builder.Property(x => x.FileName).HasMaxLength(255).IsRequired();
        builder.Property(x => x.ContentType).HasMaxLength(100);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
        builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.Reviewer).WithMany().HasForeignKey(x => x.ReviewerId);
    }
}
