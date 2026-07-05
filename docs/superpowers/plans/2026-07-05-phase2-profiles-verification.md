# Phase 2: Profiles & Verification — Implementation Plan

> **For agentic workers:** Use subagent-driven-development (recommended) or inline execution to implement this plan.

**Goal:** Build role-specific profiles (Tutor/Guardian), document upload system, phone OTP verification, and admin verification workflow.

**Architecture:** 5 new domain entities with 1:1 User relationships → EF Core migrations → repository pattern → CQRS command/handler/validator triads → API controllers → file upload middleware → Next.js profile pages with reusable components.

**Tech Stack:** ASP.NET Core 9 + MediatR + FluentValidation + EF Core + PostgreSQL 16 + Next.js 16 + Tailwind v4

**Design Spec:** `docs/superpowers/specs/2026-07-05-phase2-profiles-verification.md`

---

## Global Constraints

- TDD strictly enforced: write failing test first, watch it fail, implement, verify pass
- Follow existing Clean Architecture: Domain → Application → Infrastructure → API
- Use MediatR IRequest/IRequestHandler for all commands/queries
- Use FluentValidation for all input validation
- Match existing code style: constructors with collection initialization `= [];`
- Commit after every completed task
- All file paths relative to project root `/home/adib/Projects/Finding Your Tuition/`

---

### Task 1: Domain Enums

**Files:**
- Create: `backend/src/TuitionHub.Domain/Enums/ProficiencyLevel.cs`
- Create: `backend/src/TuitionHub.Domain/Enums/DocumentType.cs`
- Create: `backend/src/TuitionHub.Domain/Enums/VerificationStatus.cs`

- [ ] **Step 1: Create ProficiencyLevel enum**

```csharp
namespace TuitionHub.Domain.Enums;

public enum ProficiencyLevel
{
    Beginner,
    Intermediate,
    Advanced,
    Expert
}
```

- [ ] **Step 2: Create DocumentType enum**

```csharp
namespace TuitionHub.Domain.Enums;

public enum DocumentType
{
    Nid,
    Certificate,
    Result,
    Other
}
```

- [ ] **Step 3: Create VerificationStatus enum**

```csharp
namespace TuitionHub.Domain.Enums;

public enum VerificationStatus
{
    Pending,
    Approved,
    Rejected
}
```

- [ ] **Step 4: Build and commit**

```bash
cd backend && dotnet build --no-restore 2>&1 | tail -5
git add backend/src/TuitionHub.Domain/Enums/
git commit -m "feat(domain): add ProficiencyLevel, DocumentType, VerificationStatus enums"
```

---

### Task 2: TutorProfile Entity + EF Config

**Files:**
- Create: `backend/src/TuitionHub.Domain/Entities/TutorProfile.cs`
- Create: `backend/src/TuitionHub.Infrastructure/Persistence/Configurations/TutorProfileConfiguration.cs`
- Modify: `backend/src/TuitionHub.Infrastructure/Persistence/AppDbContext.cs` (add DbSet)

- [ ] **Step 1: Create TutorProfile entity**

```csharp
using TuitionHub.Domain.Enums;

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
```

- [ ] **Step 2: Create EF configuration**

```csharp
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
```

- [ ] **Step 3: Add DbSet to AppDbContext — append to class body:**

```csharp
public DbSet<TutorProfile> TutorProfiles => Set<TutorProfile>();
```

- [ ] **Step 4: Build and commit**

---

### Task 3: TutorSubject Entity + EF Config

**Files:**
- Create: `backend/src/TuitionHub.Domain/Entities/TutorSubject.cs`
- Create: `backend/src/TuitionHub.Infrastructure/Persistence/Configurations/TutorSubjectConfiguration.cs`
- Modify: `backend/src/TuitionHub.Infrastructure/Persistence/AppDbContext.cs`

- [ ] **Step 1: Create TutorSubject entity**

```csharp
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
```

- [ ] **Step 2: Create EF configuration**

```csharp
public class TutorSubjectConfiguration : IEntityTypeConfiguration<TutorSubject>
{
    public void Configure(EntityTypeBuilder<TutorSubject> builder)
    {
        builder.ToTable("tutor_subjects");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).HasMaxLength(100).IsRequired();
        builder.Property(x => x.ProficiencyLevel).HasConversion<string>().HasMaxLength(20);
        builder.Property(x => x.HourlyRate).HasPrecision(10, 2);
        builder.HasOne<TutorProfile>().WithMany(x => x.Subjects).HasForeignKey(x => x.TutorProfileId).OnDelete(DeleteBehavior.Cascade);
    }
}
```

- [ ] **Step 3: Add DbSet** — `public DbSet<TutorSubject> TutorSubjects => Set<TutorSubject>();`

- [ ] **Step 4: Build and commit**

---

### Task 4: TutorQualification Entity + EF Config

**Files:**
- Create: `backend/src/TuitionHub.Domain/Entities/TutorQualification.cs`
- Create: `backend/src/TuitionHub.Infrastructure/Persistence/Configurations/TutorQualificationConfiguration.cs`
- Modify: `backend/src/TuitionHub.Infrastructure/Persistence/AppDbContext.cs`

- [ ] **Step 1: Create TutorQualification entity**

```csharp
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
```

- [ ] **Step 2: Create EF configuration**

```csharp
public class TutorQualificationConfiguration : IEntityTypeConfiguration<TutorQualification>
{
    public void Configure(EntityTypeBuilder<TutorQualification> builder)
    {
        builder.ToTable("tutor_qualifications");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Degree).HasMaxLength(150).IsRequired();
        builder.Property(x => x.Institution).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Field).HasMaxLength(150);
        builder.HasOne<TutorProfile>().WithMany(x => x.Qualifications).HasForeignKey(x => x.TutorProfileId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.Document).WithMany().HasForeignKey(x => x.DocumentId).OnDelete(DeleteBehavior.SetNull);
    }
}
```

- [ ] **Step 3: Add DbSet and build + commit**

---

### Task 5: GuardianProfile Entity + EF Config

**Files:**
- Create: `backend/src/TuitionHub.Domain/Entities/GuardianProfile.cs`
- Create: `backend/src/TuitionHub.Infrastructure/Persistence/Configurations/GuardianProfileConfiguration.cs`
- Modify: `backend/src/TuitionHub.Infrastructure/Persistence/AppDbContext.cs`

- [ ] **Step 1: Create GuardianProfile entity**

```csharp
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
```

- [ ] **Step 2: Create EF configuration**

```csharp
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
```

- [ ] **Step 3: Add DbSet and build + commit**

---

### Task 6: Document Entity + EF Config

**Files:**
- Create: `backend/src/TuitionHub.Domain/Entities/Document.cs`
- Create: `backend/src/TuitionHub.Infrastructure/Persistence/Configurations/DocumentConfiguration.cs`
- Modify: `backend/src/TuitionHub.Infrastructure/Persistence/AppDbContext.cs`

- [ ] **Step 1: Create Document entity**

```csharp
using TuitionHub.Domain.Enums;

namespace TuitionHub.Domain.Entities;

public class Document
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public DocumentType Type { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public long? FileSize { get; set; }
    public string? ContentType { get; set; }
    public VerificationStatus Status { get; set; } = VerificationStatus.Pending;
    public Guid? ReviewerId { get; set; }
    public User? Reviewer { get; set; }
    public string? ReviewNotes { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReviewedAt { get; set; }
}
```

- [ ] **Step 2: Create EF configuration**

```csharp
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
```

- [ ] **Step 3: Add DbSet, build, commit**

---

### Task 7: EF Core Migration

**Files:**
- Generate migration via `dotnet ef migrations add`
- No manual file creation

- [ ] **Step 1: Generate migration**

```bash
cd backend && export DOTNET_ROOT=/home/adib/dotnet && export PATH="$DOTNET_ROOT:$PATH" && \
dotnet ef migrations add AddProfilesDocuments --project src/TuitionHub.Infrastructure --startup-project src/TuitionHub.Api 2>&1
```

- [ ] **Step 2: Apply migration**

```bash
dotnet ef database update --project src/TuitionHub.Infrastructure --startup-project src/TuitionHub.Api 2>&1
```

- [ ] **Step 3: Build and commit**

```bash
git add backend/src/TuitionHub.Infrastructure/Migrations/
git commit -m "feat(data): add profiles, subjects, qualifications, documents migration"
```

---

### Task 8: Repository Interfaces

**Files:**
- Create: `backend/src/TuitionHub.Domain/Interfaces/ITutorProfileRepository.cs`
- Create: `backend/src/TuitionHub.Domain/Interfaces/IGuardianProfileRepository.cs`
- Create: `backend/src/TuitionHub.Domain/Interfaces/IDocumentRepository.cs`

- [ ] **Step 1: Create ITutorProfileRepository**

```csharp
using TuitionHub.Domain.Entities;

namespace TuitionHub.Domain.Interfaces;

public interface ITutorProfileRepository
{
    Task<TutorProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task AddAsync(TutorProfile profile, CancellationToken ct = default);
    void Update(TutorProfile profile);
}
```

- [ ] **Step 2: Create IGuardianProfileRepository** — same pattern, `GuardianProfile` type

- [ ] **Step 3: Create IDocumentRepository**

```csharp
public interface IDocumentRepository
{
    Task<Document?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<Document>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task AddAsync(Document document, CancellationToken ct = default);
    void Delete(Document document);
}
```

- [ ] **Step 4: Build and commit**

---

### Task 9: Repository Implementations

**Files:**
- Create: `backend/src/TuitionHub.Infrastructure/Persistence/TutorProfileRepository.cs`
- Create: `backend/src/TuitionHub.Infrastructure/Persistence/GuardianProfileRepository.cs`
- Create: `backend/src/TuitionHub.Infrastructure/Persistence/DocumentRepository.cs`
- Modify: `backend/src/TuitionHub.Api/Program.cs` (register DI)

- [ ] **Step 1: Create TutorProfileRepository**

```csharp
using Microsoft.EntityFrameworkCore;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Infrastructure.Persistence;

public class TutorProfileRepository(AppDbContext db) : ITutorProfileRepository
{
    public async Task<TutorProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct = default) =>
        await db.TutorProfiles
            .Include(x => x.Subjects)
            .Include(x => x.Qualifications)
            .FirstOrDefaultAsync(x => x.UserId == userId, ct);

    public async Task AddAsync(TutorProfile profile, CancellationToken ct = default) =>
        await db.TutorProfiles.AddAsync(profile, ct);

    public void Update(TutorProfile profile) => db.TutorProfiles.Update(profile);
}
```

- [ ] **Step 2: Create GuardianProfileRepository** — same pattern without includes

- [ ] **Step 3: Create DocumentRepository**

```csharp
public class DocumentRepository(AppDbContext db) : IDocumentRepository
{
    public async Task<Document?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await db.Documents.FindAsync([id], ct);

    public async Task<List<Document>> GetByUserIdAsync(Guid userId, CancellationToken ct = default) =>
        await db.Documents.Where(x => x.UserId == userId).ToListAsync(ct);

    public async Task AddAsync(Document document, CancellationToken ct = default) =>
        await db.Documents.AddAsync(document, ct);

    public void Delete(Document document) => db.Documents.Remove(document);
}
```

- [ ] **Step 4: Register DI in Program.cs** — add after existing repository registrations:

```csharp
builder.Services.AddScoped<ITutorProfileRepository, TutorProfileRepository>();
builder.Services.AddScoped<IGuardianProfileRepository, GuardianProfileRepository>();
builder.Services.AddScoped<IDocumentRepository, DocumentRepository>();
```

- [ ] **Step 5: Build and commit**

---

### Task 10: GetProfileQuery (role-aware)

**Files:**
- Create: `backend/src/TuitionHub.Application/Features/Profiles/Queries/GetProfile/GetProfileQuery.cs`
- Create: `backend/src/TuitionHub.Application/Features/Profiles/Queries/GetProfile/GetProfileResult.cs`
- Create: `backend/src/TuitionHub.Application/Features/Profiles/Queries/GetProfile/GetProfileQueryHandler.cs`
- Test: `backend/tests/TuitionHub.UnitTests/GetProfileHandlerTests.cs`

- [ ] **Step 1: Write failing test**

Create test file with 2 tests:
1. `GetProfile_Guardian_ReturnsGuardianProfile` — seed a Guardian user with profile, query, assert guardian fields present
2. `GetProfile_Tutor_ReturnsTutorProfile` — seed a Tutor user with profile + subjects, query, assert tutor fields present

- [ ] **Step 2: Verify tests fail** — `dotnet test`

- [ ] **Step 3: Create Query + Result + Handler**

Query accepts `UserId` (Guid, from JWT claims). Handler checks `User.Role`:
- `Guardian` → queries `IGuardianProfileRepository.GetByUserIdAsync`
- `Tutor` → queries `ITutorProfileRepository.GetByUserIdAsync` (includes subjects + qualifications)
- Return unified DTO with role-specific fields nullable

- [ ] **Step 4: Verify tests pass**

- [ ] **Step 5: Commit**

---

### Task 11: UpdateTutorProfileCommand

**Files:**
- Create: `backend/src/TuitionHub.Application/Features/Profiles/Commands/UpdateTutorProfile/UpdateTutorProfileCommand.cs`
- Create: Handler + Validator
- Test: `backend/tests/TuitionHub.UnitTests/UpdateTutorProfileHandlerTests.cs`

- [ ] **Step 1: Write failing tests (create + update)**

- [ ] **Step 2: Build Command/Handler/Validator**

Handler flow:
1. Get existing profile via repository, or create new if not exists
2. Update scalar fields (bio, hourlyRate, experience, areas, travel, days)
3. Replace subjects collection (clear + add new)
4. Replace qualifications collection (clear + add new)
5. Call repo.AddAsync (new) or Update (existing)

Validator: bio ≤ 1000 chars, hourlyRate > 0, at least 1 subject, each subject has name + proficiency

- [ ] **Step 3: Pass tests**

- [ ] **Step 4: Commit**

---

### Task 12: UpdateGuardianProfileCommand

**Files:**
- Create: `backend/src/TuitionHub.Application/Features/Profiles/Commands/UpdateGuardianProfile/UpdateGuardianProfileCommand.cs`
- Handler + Validator
- Test: `UpdateGuardianProfileHandlerTests.cs`

- [ ] **Step 1: TDD — test → fail → implement → pass**

Similar to Task 11, simpler (no child collections). Handler creates or updates a GuardianProfile.

- [ ] **Step 2: Commit**

---

### Task 13: GetTutorProfileQuery (public)

**Files:**
- Create: `backend/src/TuitionHub.Application/Features/Profiles/Queries/GetTutorProfile/GetTutorProfileQuery.cs`
- Handler + Result DTO

- [ ] **Step 1: Implement** — returns public-safe tutor profile (name, bio, subjects, qualifications, hourlyRate, experience). No sensitive data.

- [ ] **Step 2: Commit**

---

### Task 14: RequestOtpCommand + VerifyOtpCommand

**Files:**
- Create: `backend/src/TuitionHub.Application/Features/Verification/Commands/RequestOtp/RequestOtpCommand.cs`
- Create: `backend/src/TuitionHub.Application/Features/Verification/Commands/VerifyOtp/VerifyOtpCommand.cs`
- Handlers + Validators
- Tests

- [ ] **Step 1: RequestOtp—TDD**

Handler: generate 6-digit random code, create OtpCode entity (type=phone_verification, expires=10min), save to DB, log code to console via `ILogger`.

Validator: phone must match BD format `+8801XXXXXXXXX`

- [ ] **Step 2: VerifyOtp—TDD**

Handler: find unused, unexpired OTP for user of type phone_verification, compare code, mark is_used=true. If valid: set user's IsPhoneVerified flag (TODO: add `IsPhoneVerified` to User entity if not exists).

Validator: 6-digit numeric code required

- [ ] **Step 3: Add `IsPhoneVerified` bool to User entity + migration if missing**

- [ ] **Step 4: Commit**

---

### Task 15: Document Upload/Get/Delete Commands

**Files:**
- Create: `backend/src/TuitionHub.Application/Features/Documents/Commands/UploadDocument/UploadDocumentCommand.cs`
- Create: `backend/src/TuitionHub.Application/Features/Documents/Queries/GetDocuments/GetDocumentsQuery.cs`
- Create: `backend/src/TuitionHub.Application/Features/Documents/Commands/DeleteDocument/DeleteDocumentCommand.cs`
- Handlers + Validators
- Tests

- [ ] **Step 1: UploadDocument — TDD**

Handler: validates file type (jpg/png/pdf) and size (5MB max), generates unique filename `{guid}_{original}`, saves to `uploads/{userId}/`, creates Document entity, returns document ID + URL.

- [ ] **Step 2: GetDocuments — TDD**

Handler: returns all documents for user, ordered by submittedAt descending.

- [ ] **Step 3: DeleteDocument — TDD**

Handler: find document by ID, verify ownership, verify status=pending (cannot delete approved/rejected), delete file from disk, delete entity.

- [ ] **Step 4: Commit**

---

### Task 16: Verification Workflow Commands

**Files:**
- Create: `backend/src/TuitionHub.Application/Features/Verification/Commands/SubmitForVerification/SubmitForVerificationCommand.cs`
- Create: `backend/src/TuitionHub.Application/Features/Verification/Queries/GetPendingVerifications/GetPendingVerificationsQuery.cs`
- Create: `backend/src/TuitionHub.Application/Features/Verification/Commands/ApproveProfile/ApproveProfileCommand.cs`
- Create: `backend/src/TuitionHub.Application/Features/Verification/Commands/RejectProfile/RejectProfileCommand.cs`
- Handlers + Validators + Tests

- [ ] **Step 1: SubmitForVerification — TDD**

Handler: check user has phone verified and at least 1 document, set user to pending verification state (add `VerificationState` enum to User? or just check IsVerified=false as pending).

- [ ] **Step 2: GetPendingVerifications — TDD**

Handler: returns users where IsVerified=false and they have documents (meaning they submitted). Include user info + document count. Admin-only.

- [ ] **Step 3: ApproveProfile — TDD**

Handler: set user.IsVerified=true, set all user's documents to approved. Admin-only.

- [ ] **Step 4: RejectProfile — TDD**

Handler: set review notes, documents remain pending but user can re-submit. Admin-only.

- [ ] **Step 5: Commit**

---

### Task 17: Profile Controller + OTP Controller

**Files:**
- Create: `backend/src/TuitionHub.Api/Controllers/ProfileController.cs`
- Create: `backend/src/TuitionHub.Api/Controllers/OtpController.cs`
- Modify: `backend/src/TuitionHub.Api/Program.cs` (add authorization policy for admin)

- [ ] **Step 1: Create ProfileController** — endpoints: `GET /api/profile`, `PUT /api/profile`, `GET /api/tutors/{id}`. Extract userId from JWT claims (ClaimTypes.NameIdentifier).

- [ ] **Step 2: Create OtpController** — endpoints: `POST /api/otp/request`, `POST /api/otp/verify`

- [ ] **Step 3: Build and verify endpoints compile**

- [ ] **Step 4: Commit**

---

### Task 18: Document Controller + Verification Controller

**Files:**
- Create: `backend/src/TuitionHub.Api/Controllers/DocumentController.cs`
- Create: `backend/src/TuitionHub.Api/Controllers/VerificationController.cs`
- Modify: `backend/src/TuitionHub.Api/Program.cs` (add static file middleware for uploads)

- [ ] **Step 1: Create DocumentController** — `POST /api/documents` (multipart), `GET /api/documents`, `DELETE /api/documents/{id}`. Configure upload directory in Program.cs.

- [ ] **Step 2: Create VerificationController** — `POST /api/verification/submit`, `GET /api/admin/verifications` [Authorize(Roles="SubAdmin,SuperAdmin")], `POST /api/admin/verifications/{id}/approve`, `POST /api/admin/verifications/{id}/reject`

- [ ] **Step 3: Add static file middleware** in Program.cs:

```csharp
var uploadsPath = Path.Combine(builder.Environment.ContentRootPath, "uploads");
Directory.CreateDirectory(uploadsPath);
app.UseStaticFiles(new StaticFileOptions { FileProvider = new PhysicalFileProvider(uploadsPath), RequestPath = "/uploads" });
```

- [ ] **Step 4: Commit**

---

### Task 19: Register Role Fix + DI Registration

**Files:**
- Modify: `backend/src/TuitionHub.Api/Program.cs` (full DI sweep + role-aware registration fix)
- Modify: `backend/src/TuitionHub.Application/Features/Auth/Commands/Register/RegisterCommand.cs` (add Role field)
- Modify: `backend/src/TuitionHub.Application/Features/Auth/Commands/Register/RegisterCommandHandler.cs` (use command.Role instead of hardcoded Guardian)
- Modify: `backend/src/TuitionHub.Application/Features/Auth/Commands/Register/RegisterCommandValidator.cs` (validate Role)

- [ ] **Step 1: Fix RegisterCommand to accept role** — add `public UserRole Role { get; set; } = UserRole.Guardian;` to command

- [ ] **Step 2: Fix handler** — `Role = command.Role` instead of `Role = UserRole.Guardian`

- [ ] **Step 3: Add role field to frontend register API** — `export interface RegisterInput { ..., role: "tutor" | "guardian"; }` in `lib/api.ts`

- [ ] **Step 4: Full DI sweep** — verify all new services registered in Program.cs

- [ ] **Step 5: Build and run all tests**

```bash
cd backend && dotnet test 2>&1 | tail -20
```

- [ ] **Step 6: Commit**

---

### Task 20: Frontend — Profile Settings Page

**Files:**
- Create: `frontend/src/components/sections/ProfileForm.tsx`
- Create: `frontend/src/components/sections/TutorSubjectEditor.tsx`
- Create: `frontend/src/components/sections/QualificationList.tsx`
- Create: `frontend/src/components/sections/VerificationStatus.tsx`
- Create: `frontend/src/app/(dashboard)/profile/page.tsx`

- [ ] **Step 1: Create ProfileForm** — role-aware, switches sections based on user role. Common: Bio (textarea). Tutor: Hourly Rate, Experience, Preferred Areas (comma-input), Max Travel, Available Days (checkboxes). Guardian: Location, Children Count, Budget Min/Max.

- [ ] **Step 2: Create TutorSubjectEditor** — add/remove rows: subject name input + proficiency dropdown + hourlyRate. Uses `useState` array.

- [ ] **Step 3: Create QualificationList** — add/remove rows: degree, institution, field, year.

- [ ] **Step 4: Create VerificationStatus** — step indicator with 5 states. Green for completed, gray for pending, animated for current.

- [ ] **Step 5: Create /dashboard/profile page** — compose all components, add save button, add API calls via extended `lib/api.ts`

---

### Task 21: Frontend — Document Upload Page

**Files:**
- Create: `frontend/src/components/sections/DocumentUpload.tsx`
- Create: `frontend/src/app/(dashboard)/profile/documents/page.tsx`
- Modify: `frontend/src/lib/api.ts` (add document API functions)

- [ ] **Step 1: Add document APIs to api.ts**
- [ ] **Step 2: Create DocumentUpload component** — file input + drag-drop zone + type selector + progress bar + preview
- [ ] **Step 3: Create /profile/documents page** — upload area at top, document list below with status badges + delete buttons

---

### Task 22: Frontend — OTP Input + Verification Page

**Files:**
- Create: `frontend/src/components/sections/OtpInput.tsx`
- Create: `frontend/src/app/(dashboard)/profile/verification/page.tsx`

- [ ] **Step 1: Create OtpInput** — 6 individual digit boxes, auto-focus, paste support, resend countdown timer

- [ ] **Step 2: Create verification page** — phone verification section (request OTP button → OTP input → verify), submit for review button (disabled until phone verified + 1 doc uploaded)

---

### Task 23: Frontend — Admin Verification Page

**Files:**
- Create: `frontend/src/components/sections/AdminVerificationCard.tsx`
- Create: `frontend/src/app/admin/verifications/page.tsx`

- [ ] **Step 1: Create AdminVerificationCard** — user info, role, submitted date, document count with preview links, approve/reject buttons

- [ ] **Step 2: Create admin verifications page** — list of pending cards, reject modal with reason textarea, filter by role/date

---

### Task 24: Final Build + Test Verification

- [ ] **Step 1: Run all backend tests**

```bash
cd backend && export DOTNET_ROOT=/home/adib/dotnet && export PATH="$DOTNET_ROOT:$PATH" && dotnet test 2>&1 | tail -20
```
Expected: All tests pass

- [ ] **Step 2: Build backend**

```bash
dotnet build --no-restore 2>&1 | tail -5
```
Expected: 0 errors

- [ ] **Step 3: Build frontend**

```bash
cd ../frontend && npm run build 2>&1 | tail -15
```
Expected: ✓ Generated static pages

- [ ] **Step 4: Run backend lint** — `dotnet format --verify-no-changes 2>&1 || true`

- [ ] **Step 5: Run frontend lint** — `npx eslint src/ --max-warnings=0`

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: complete Phase 2 - profiles, documents, OTP verification, admin workflow"
```
