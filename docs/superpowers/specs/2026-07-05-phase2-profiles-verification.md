# TuitionHub BD — Phase 2: Profiles & Verification Design Spec

> **Status:** Draft  
> **Date:** 2026-07-05  
> **Stack:** ASP.NET Core 9 + MediatR + EF Core + Next.js 16 + Tailwind v4 + PostgreSQL 16 + Redis 7

---

## 1. Overview

Phase 2 adds role-specific profiles, document uploads, phone OTP verification, and an admin verification workflow. Users register with a role (Tutor/Guardian), then complete their profile with role-specific fields, upload verification documents, and have their profile reviewed by an admin before being marked verified.

---

## 2. Database Design

### 2.1 New Tables

#### `tutor_profiles`
```sql
CREATE TABLE tutor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    bio TEXT,
    hourly_rate DECIMAL(10,2),
    experience_years INT CHECK (experience_years >= 0),
    preferred_areas TEXT[],
    max_travel_km INT,
    available_days TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_tutor_profiles_user ON tutor_profiles(user_id);
```

#### `tutor_subjects`
```sql
CREATE TABLE tutor_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_profile_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(20) NOT NULL,
    hourly_rate DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_tutor_subjects_profile ON tutor_subjects(tutor_profile_id);
```

#### `tutor_qualifications`
```sql
CREATE TABLE tutor_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_profile_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    degree VARCHAR(150) NOT NULL,
    institution VARCHAR(200) NOT NULL,
    field VARCHAR(150),
    year INT,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_tutor_qualifications_profile ON tutor_qualifications(tutor_profile_id);
```

#### `guardian_profiles`
```sql
CREATE TABLE guardian_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    bio TEXT,
    location VARCHAR(300),
    preferred_subjects TEXT[],
    children_count INT CHECK (children_count >= 0),
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_guardian_profiles_user ON guardian_profiles(user_id);
```

#### `documents`
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type document_type NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    content_type VARCHAR(100),
    status verification_status DEFAULT 'pending',
    reviewer_id UUID REFERENCES users(id),
    review_notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);
```

### 2.2 New Enums (PostgreSQL)

```sql
CREATE TYPE proficiency_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE document_type AS ENUM ('nid', 'certificate', 'result', 'other');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
```

### 2.3 Extension to Existing `otp_codes` Usage

The `otp_codes` table already exists with `type otp_type` (`email_verification`, `phone_verification`, `password_reset`). Phase 2 adds **phone_verification** usage:
- `POST /api/otp/request` creates a `phone_verification` OTP code, stores it, returns success
- `POST /api/otp/verify` checks the code, marks `is_used = true`, marks user's phone as verified
- Dev/staging: log OTP code to console (no SMS gateway yet)

---

## 3. Domain Entities

### 3.1 New Entities

**`TutorProfile.cs`**
```csharp
public class TutorProfile {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
    public string? Bio { get; set; }
    public decimal? HourlyRate { get; set; }
    public int? ExperienceYears { get; set; }
    public List<string> PreferredAreas { get; set; } = [];
    public int? MaxTravelKm { get; set; }
    public List<string> AvailableDays { get; set; } = [];
    public ICollection<TutorSubject> Subjects { get; set; } = [];
    public ICollection<TutorQualification> Qualifications { get; set; } = [];
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

**`TutorSubject.cs`**
```csharp
public enum ProficiencyLevel { Beginner, Intermediate, Advanced, Expert }
public class TutorSubject {
    public Guid Id { get; set; }
    public Guid TutorProfileId { get; set; }
    public string Name { get; set; }
    public ProficiencyLevel ProficiencyLevel { get; set; }
    public decimal? HourlyRate { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

**`TutorQualification.cs`**
```csharp
public class TutorQualification {
    public Guid Id { get; set; }
    public Guid TutorProfileId { get; set; }
    public string Degree { get; set; }
    public string Institution { get; set; }
    public string? Field { get; set; }
    public int? Year { get; set; }
    public Guid? DocumentId { get; set; }
    public Document? Document { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

**`GuardianProfile.cs`**
```csharp
public class GuardianProfile {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
    public string? Bio { get; set; }
    public string? Location { get; set; }
    public List<string> PreferredSubjects { get; set; } = [];
    public int? ChildrenCount { get; set; }
    public decimal? BudgetMin { get; set; }
    public decimal? BudgetMax { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

**`Document.cs`**
```csharp
public enum DocumentType { Nid, Certificate, Result, Other }
public enum VerificationStatus { Pending, Approved, Rejected }
public class Document {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DocumentType Type { get; set; }
    public string FilePath { get; set; }
    public string FileName { get; set; }
    public long? FileSize { get; set; }
    public string? ContentType { get; set; }
    public VerificationStatus Status { get; set; } = VerificationStatus.Pending;
    public Guid? ReviewerId { get; set; }
    public string? ReviewNotes { get; set; }
    public DateTime SubmittedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
}
```

---

## 4. CQRS Commands & Queries

### 4.1 Profile Management

| Command/Query | Endpoint | Description |
|---|---|---|
| `GetProfileQuery` | `GET /api/profile` | Returns role-aware profile (TutorProfile or GuardianProfile based on User.Role) |
| `UpdateTutorProfileCommand` | `PUT /api/profile` | Updates TutorProfile + Subjects + Qualifications (role-gated to Tutor) |
| `UpdateGuardianProfileCommand` | `PUT /api/profile` | Updates GuardianProfile (role-gated to Guardian) |
| `GetTutorProfileQuery` | `GET /api/tutors/{id}` | Public tutor profile view |

### 4.2 OTP Verification

| Command | Endpoint | Description |
|---|---|---|
| `RequestOtpCommand` | `POST /api/otp/request` | Generates 6-digit code, stores in otp_codes, logs to console |
| `VerifyOtpCommand` | `POST /api/otp/verify` | Validates code, marks phone as verified |

### 4.3 Document Management

| Command/Query | Endpoint | Description |
|---|---|---|
| `UploadDocumentCommand` | `POST /api/documents` | Multipart upload, saves to `uploads/{userId}/`, creates Document entity |
| `GetDocumentsQuery` | `GET /api/documents` | Lists current user's documents |
| `DeleteDocumentCommand` | `DELETE /api/documents/{id}` | Deletes file + entity (only if status = pending) |

### 4.4 Verification Workflow

| Command/Query | Endpoint | Role |
|---|---|---|
| `SubmitForVerificationCommand` | `POST /api/verification/submit` | User submits profile for admin review (must have phone verified + 1 document) |
| `GetPendingVerificationsQuery` | `GET /api/admin/verifications` | SubAdmin/SuperAdmin |
| `ApproveProfileCommand` | `POST /api/admin/verifications/{id}/approve` | Sets user.IsVerified = true |
| `RejectProfileCommand` | `POST /api/admin/verifications/{id}/reject` | Sets rejection notes, user re-submits |

### 4.5 Validators

- `UpdateTutorProfileCommandValidator`: bio max 1000 chars, hourly_rate > 0, at least 1 subject
- `UpdateGuardianProfileCommandValidator`: bio max 1000 chars
- `RequestOtpCommandValidator`: valid BD phone format
- `VerifyOtpCommandValidator`: 6-digit code, not expired, not used
- `UploadDocumentCommandValidator`: file type (jpg/png/pdf), max 5MB, valid DocumentType

---

## 5. Repository Interfaces (new)

```csharp
// Domain/Interfaces/
ITutorProfileRepository  — GetByUserIdAsync, AddAsync, UpdateAsync
IGuardianProfileRepository — GetByUserIdAsync, AddAsync, UpdateAsync
IDocumentRepository — GetByIdAsync, GetByUserIdAsync, AddAsync, DeleteAsync
```

---

## 6. Frontend Pages

### 6.1 Profile Settings (`/dashboard/profile`)
- Role-aware form: Tutor sees subjects, qualifications, rate; Guardian sees location, children, budget
- Sections: Basic Info (read-only: name, email, phone) → Profile Details → Subjects (tutor) → Qualifications (tutor)
- Save button per section
- Verification status indicator at top

### 6.2 Documents (`/dashboard/profile/documents`)
- Upload area (drag-drop or browse)
- Document list with status badges (pending/approved/rejected)
- Delete pending documents
- Type selector: NID / Certificate / Result / Other

### 6.3 Verification (`/dashboard/profile/verification`)
- Step indicator: 1. Phone Verified → 2. Documents Uploaded → 3. Submitted → 4. Under Review → 5. Verified
- "Verify Phone" button → OTP modal
- "Submit for Verification" button (enabled when phone verified + 1 document)
- Admin notes displayed if rejected

### 6.4 Admin Verifications (`/admin/verifications`)
- List of pending verification submissions
- Each card: user name, role, submitted date, documents preview
- Approve / Reject buttons
- Reject modal with reason textarea

---

## 7. New Components

| Component | Purpose |
|---|---|
| `ProfileForm.tsx` | Role-aware form with dynamic sections |
| `DocumentUpload.tsx` | File input + drag-drop + preview + progress |
| `OtpInput.tsx` | 6-digit input with auto-focus, resend countdown |
| `VerificationStatus.tsx` | Step indicator (Pending → Verified) |
| `TutorSubjectEditor.tsx` | Add/remove subjects with proficiency dropdown |
| `QualificationList.tsx` | CRUD for qualifications |
| `AdminVerificationCard.tsx` | Review card with document previews |

---

## 8. File Storage

- **Root:** `backend/uploads/{userId}/`
- **Naming:** `{guid}_{originalFilename}`
- **Serving:** Static file middleware at `/uploads/` path
- **Security:** Only owner or admin can access files (middleware check)
- **Limits:** Max 5MB per file, jpg/png/pdf only
- **Cleanup:** Cascade on user delete, orphaned files cleaned on document delete

---

## 9. TDD Strategy

For each feature, order of implementation:
1. Entity → EF Config → Migration
2. Repository interface → Repository implementation
3. Command/Query + Handler + Validator (fail test first)
4. Controller endpoint
5. Integration test (optional for Phase 2)
6. Frontend page + component

---

## 10. What This Phase Does NOT Include

- SMS gateway integration (Phase 7 — monetization)
- bKash/Nagad integration (Phase 3)
- NID OCR/AI verification (Phase 7)
- File virus scanning (Phase 8)
- Tutor availability calendar (Phase 3)
- Guardian children profiles (Phase 3)
