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
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, error.error ?? "Request failed");
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
