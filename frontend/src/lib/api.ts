const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts?: RequestOptions,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...opts?.headers,
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: opts?.signal,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    const message = body.details 
      ? body.details.map((d: { field: string; message: string }) => d.message).join(". ")
      : (body.error ?? "Request failed");
    throw new ApiError(res.status, message);
  }

  return res.json();
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Auth ──────────────────────────────────────────────────────────

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: "tutor" | "guardian";
}

export interface AuthResult {
  userId: string;
  email: string;
  fullName: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshInput {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  register: (data: RegisterInput) =>
    request<AuthResult>("POST", "/auth/register", data),

  login: (data: LoginInput) =>
    request<AuthResult>("POST", "/auth/login", data),

  refresh: (data: RefreshInput) =>
    request<AuthResult>("POST", "/auth/refresh", data),
};

// ── Profile ───────────────────────────────────────────────────────

export interface ProfileResult {
  userId: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  bio: string | null;
  // Tutor
  hourlyRate: number | null;
  experienceYears: number | null;
  preferredAreas: string[] | null;
  maxTravelKm: number | null;
  availableDays: string[] | null;
  subjects: TutorSubjectDto[] | null;
  qualifications: QualificationDto[] | null;
  // Guardian
  location: string | null;
  preferredSubjects: string[] | null;
  childrenCount: number | null;
  budgetMin: number | null;
  budgetMax: number | null;
}

export interface TutorSubjectDto {
  name: string;
  proficiencyLevel: string;
  hourlyRate: number | null;
}

export interface QualificationDto {
  degree: string;
  institution: string;
  field: string | null;
  year: number | null;
}

export interface SubjectInput {
  name: string;
  proficiencyLevel: string;
  hourlyRate: number | null;
}

export interface QualificationInput {
  degree: string;
  institution: string;
  field: string | null;
  year: number | null;
}

export interface TutorProfileUpdate {
  bio?: string;
  hourlyRate?: number;
  experienceYears?: number;
  preferredAreas?: string[];
  maxTravelKm?: number;
  availableDays?: string[];
  subjects?: SubjectInput[];
  qualifications?: QualificationInput[];
}

export interface GuardianProfileUpdate {
  bio?: string;
  location?: string;
  preferredSubjects?: string[];
  childrenCount?: number;
  budgetMin?: number;
  budgetMax?: number;
}

export const profileApi = {
  get: () => request<ProfileResult>("GET", "/profile"),
  updateTutor: (data: TutorProfileUpdate) =>
    request<{ message: string }>("PUT", "/profile", data),
  updateGuardian: (data: GuardianProfileUpdate) =>
    request<{ message: string }>("PUT", "/profile", data),
};

// ── OTP ────────────────────────────────────────────────────────────

export interface OtpRequest {
  phone: string;
}

export interface OtpVerify {
  code: string;
}

export interface OtpVerifyResult {
  success: boolean;
  message: string;
}

export const otpApi = {
  request: (data: OtpRequest) =>
    request<{ message: string }>("POST", "/otp/request", data),
  verify: (data: OtpVerify) =>
    request<OtpVerifyResult>("POST", "/otp/verify", data),
};

// ── Documents ──────────────────────────────────────────────────────

export interface DocumentDto {
  id: string;
  type: string;
  fileName: string;
  filePath: string;
  fileSize: number | null;
  contentType: string;
  status: string;
  submittedAt: string;
  reviewedAt: string | null;
  reviewNotes: string | null;
}

export const documentApi = {
  upload: async (file: File, type: string): Promise<{ id: string }> => {
    const form = new FormData();
    form.append("file", file);
    form.append("type", type);
    return multipartRequest<{ id: string }>("POST", "/documents", form);
  },
  list: () => request<DocumentDto[]>("GET", "/documents"),
  delete: (id: string) =>
    request<{ message: string }>("DELETE", `/documents/${id}`),
};

async function multipartRequest<T>(
  method: string,
  path: string,
  formData: FormData,
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, error.error ?? "Upload failed");
  }

  return res.json();
}

// ── Verification ───────────────────────────────────────────────────

export interface PendingVerification {
  userId: string;
  fullName: string;
  role: string;
  phone: string | null;
  documentCount: number;
  submittedAt: string;
}

export const verificationApi = {
  submit: () =>
    request<{ message: string }>("POST", "/verification/submit"),
  getPending: () =>
    request<PendingVerification[]>("GET", "/admin/verifications"),
  approve: (userId: string) =>
    request<{ message: string }>("POST", `/admin/verifications/${userId}/approve`),
  reject: (userId: string, reason: string) =>
    request<{ message: string }>("POST", `/admin/verifications/${userId}/reject`, { reason }),
};

// ── Token helpers ─────────────────────────────────────────────────

export function storeTokens(result: AuthResult) {
  localStorage.setItem("accessToken", result.accessToken);
  localStorage.setItem("refreshToken", result.refreshToken);
  localStorage.setItem("tokenExpires", result.expiresAt);
  localStorage.setItem("userId", result.userId);
}

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenExpires");
  localStorage.removeItem("userId");
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const expires = localStorage.getItem("tokenExpires");
  if (!expires) return false;
  return new Date(expires) > new Date();
}
