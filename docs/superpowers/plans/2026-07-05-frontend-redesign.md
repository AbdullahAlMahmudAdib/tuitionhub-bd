# TuitionHub BD — Frontend Redesign Implementation Plan

> **For agentic workers:** Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task.

**Goal:** Transform the wireframe-level frontend into a polished Bangladesh-heritage design with full design system, shared components, layout shells, and redesigned pages.

**Architecture:** Atomic design — build design tokens first, then atomic UI components, then layout shells, then page sections, then compose into pages. Each layer builds on the previous.

**Tech Stack:** Next.js 16 + Tailwind CSS v4 + Motion (Framer Motion v12) + Serwist PWA + Inter + Noto Sans Bengali

**Design Spec:** `docs/superpowers/specs/2026-07-05-frontend-design.md`

---

## Global Constraints

- All components must be Server Components by default — only add `"use client"` when hooks or browser APIs are needed
- Use Tailwind CSS v4 `@theme` for design tokens (not `tailwind.config.ts`)
- TypeScript strict mode — no `any`, no `@ts-ignore`
- Mobile-first responsive — all layouts default to mobile, expand with `sm:` / `md:` / `lg:`
- Use the existing `motion` package for all animations (already installed)
- Follow existing directory structure: `src/components/`, `src/app/`
- No new npm dependencies beyond what's already in `package.json`
- Every component file gets a brief JSDoc comment explaining purpose
- `primary` color in Tailwind = `#006A4E`, `cta` = `#DA291C`

---

### Task 1: Tailwind v4 Theme Tokens + Global CSS

**Files:**
- Modify: `frontend/src/app/globals.css`

**Interfaces:**
- Consumes: nothing
- Produces: color/spacing/typography tokens used by all components

- [ ] **Step 1: Write globals.css with full design tokens**

```css
@import "tailwindcss";

/* ── Google Fonts ────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Bengali:wght@400;500;700&display=swap');

/* ── Design Tokens ───────────────────────────────────── */
@theme inline {
  --color-primary: #006A4E;
  --color-primary-dark: #004D39;
  --color-primary-light: #E8F5F0;
  --color-cta: #DA291C;
  --color-cta-light: #FDE8E7;
  --color-ivory: #FFF8F0;
  --color-neutral-900: #1A1A2E;
  --color-neutral-700: #334155;
  --color-neutral-500: #64748B;
  --color-neutral-200: #E2E8F0;
  --color-neutral-100: #F1F5F9;

  --font-heading: 'Inter', 'Noto Sans Bengali', sans-serif;
  --font-body: 'Inter', 'Noto Sans Bengali', sans-serif;
}

/* ── Base Styles ─────────────────────────────────────── */
body {
  font-family: var(--font-body);
  background-color: var(--color-ivory);
  color: var(--color-neutral-900);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Scrollbar ────────────────────────────────────────── */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--color-neutral-200);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-neutral-500);
}

/* ── Animations ───────────────────────────────────────── */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes pulse-loader {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.4; }
}
@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(100%); }
  to   { opacity: 1; transform: translateX(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out forwards;
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
.animate-pulse-loader {
  animation: pulse-loader 1.5s ease-in-out infinite;
}
.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out forwards;
}

/* ── Stagger child animations (for motion) ───────────── */
.stagger-container > * {
  opacity: 0;
}
```

- [ ] **Step 2: Verify build still works**

```bash
cd frontend && npm run build 2>&1 | tail -5
```
Expected: `✓ Build completed successfully`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/globals.css
git commit -m "feat(frontend): add Tailwind v4 theme tokens and global CSS"
```

---

### Task 2: Button Component

**Files:**
- Create: `frontend/src/components/ui/Button.tsx`

**Interfaces:**
- Consumes: theme tokens from globals.css
- Produces: shared Button used across all pages

- [ ] **Step 1: Create Button component**

```tsx
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "cta" | "outline" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark focus:ring-2 focus:ring-primary/40",
  cta:
    "bg-cta text-white hover:bg-red-700 focus:ring-2 focus:ring-cta/40",
  outline:
    "border-2 border-primary text-primary hover:bg-primary-light focus:ring-2 focus:ring-primary/40",
  ghost:
    "text-primary hover:bg-primary-light focus:ring-2 focus:ring-primary/40",
  link:
    "text-primary underline-offset-2 hover:underline focus:underline inline",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-lg gap-2",
  lg: "px-6 py-3 text-base rounded-lg gap-2.5",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
cd frontend && npm run build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ui/Button.tsx
git commit -m "feat(frontend): add Button component with 5 variants"
```

---

### Task 3: Input Component

**Files:**
- Create: `frontend/src/components/ui/Input.tsx`

**Interfaces:**
- Consumes: theme tokens
- Produces: shared Input used in auth forms and search

- [ ] **Step 1: Create Input component**

```tsx
import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-500 shadow-sm transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary ${
              icon ? "pl-10" : ""
            } ${
              error
                ? "border-cta focus:ring-cta/40 focus:border-cta"
                : "border-neutral-200"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-cta">{error}</p>}
        {helper && !error && <p className="text-xs text-neutral-500">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
```

- [ ] **Step 2: Verify build**

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ui/Input.tsx
git commit -m "feat(frontend): add Input component with label, error, icon support"
```

---

### Task 4: Card Component

**Files:**
- Create: `frontend/src/components/ui/Card.tsx`

- [ ] **Step 1: Create Card component**

```tsx
import { ReactNode } from "react";

type CardVariant = "default" | "interactive" | "bordered";
type CardPadding = "sm" | "md" | "lg";

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white shadow-sm",
  interactive: "bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
  bordered: "bg-white border border-neutral-200",
};

const paddingStyles: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  variant = "default",
  padding = "md",
  className = "",
  children,
  onClick,
}: CardProps) {
  return (
    <div
      className={`rounded-xl transition-all duration-200 ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ui/Card.tsx
git commit -m "feat(frontend): add Card component with 3 variants"
```

---

### Task 5: Badge, Avatar, Skeleton Components

**Files:**
- Create: `frontend/src/components/ui/Badge.tsx`
- Create: `frontend/src/components/ui/Avatar.tsx`
- Create: `frontend/src/components/ui/Skeleton.tsx`

- [ ] **Step 1: Create Badge component**

```tsx
import { ReactNode } from "react";

type BadgeVariant = "verified" | "premium" | "pending" | "featured" | "success" | "warning";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  premium: "bg-cta-light text-cta border-cta/20",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  featured: "bg-cta-light text-cta border-cta/20",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function Badge({ variant = "verified", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {variant === "verified" && (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zM10 6a1 1 0 011 1v3a1 1 0 11-2 0V7a1 1 0 011-1zm0 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      )}
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Create Avatar component**

```tsx
interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Predefined background colors for initials
const bgColors = [
  "bg-primary",
  "bg-primary-dark",
  "bg-cta",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-blue-600",
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return bgColors[Math.abs(hash) % bgColors.length];
}

export default function Avatar({ src, name, size = "md", online, className = "" }: AvatarProps) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeStyles[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeStyles[size]} rounded-full flex items-center justify-center text-white font-semibold ${getColor(name)}`}
        >
          {getInitials(name)}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create Skeleton component**

```tsx
type SkeletonVariant = "text" | "circular" | "rectangular" | "card";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

const variantClass: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded",
  circular: "h-10 w-10 rounded-full",
  rectangular: "h-32 w-full rounded-lg",
  card: "h-48 w-full rounded-xl",
};

export default function Skeleton({ variant = "text", className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse-loader bg-neutral-100 ${variantClass[variant]} ${className}`}
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 4: Verify build**

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/ui/
git commit -m "feat(frontend): add Badge, Avatar, Skeleton components"
```

---

### Task 6: Modal and Toast Components

**Files:**
- Create: `frontend/src/components/ui/Modal.tsx`
- Create: `frontend/src/components/ui/Toast.tsx`

- [ ] **Step 1: Create Modal component**

```tsx
"use client";

import { useEffect, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${sizeStyles[size]} rounded-xl bg-white p-6 shadow-lg`}
          >
            {title && (
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Create Toast component**

```tsx
"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  show: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const iconMap: Record<ToastType, ReactNode> = {
  success: (
    <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const bgMap: Record<ToastType, string> = {
  success: "border-l-4 border-emerald-500",
  error: "border-l-4 border-cta",
  info: "border-l-4 border-blue-500",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className={`pointer-events-auto flex items-center gap-3 rounded-lg bg-white p-4 shadow-lg ${bgMap[toast.type]}`}
            >
              {iconMap[toast.type]}
              <p className="text-sm text-neutral-700">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
```

- [ ] **Step 3: Verify build**

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/ui/Modal.tsx frontend/src/components/ui/Toast.tsx
git commit -m "feat(frontend): add Modal and Toast components with motion animations"
```

---

### Task 7: Logo Component

**Files:**
- Create: `frontend/src/components/shared/Logo.tsx`

- [ ] **Step 1: Create Logo component**

```tsx
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export default function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 font-extrabold tracking-tight ${sizeStyles[size]} ${className}`}>
      <span className="text-primary">Tuition</span>
      <span className="text-cta">Hub</span>
      <span className="text-neutral-500 text-[0.5em] font-normal">BD</span>
    </Link>
  );
}
```

- [ ] **Step 2: Verify build**

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/shared/Logo.tsx
git commit -m "feat(frontend): add Logo component with brand colors"
```

---

### Task 8: Logo Component

Wait, this is a duplicate from my plan. Let me skip this and move to the layout components.

---

### Task 8: Navbar Component

**Files:**
- Create: `frontend/src/components/layout/Navbar.tsx`

- [ ] **Step 1: Create Navbar component**

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import Button from "@/components/ui/Button";
import { isAuthenticated } from "@/lib/api";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const authed = isAuthenticated();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo size="md" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/tutors" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
            Find Tutors
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
            How It Works
          </Link>
          {authed ? (
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/tutors" className="text-sm font-medium text-neutral-700" onClick={() => setMobileOpen(false)}>
              Find Tutors
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-neutral-700" onClick={() => setMobileOpen(false)}>
              How It Works
            </Link>
            {authed ? (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Verify build**

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/layout/Navbar.tsx
git commit -m "feat(frontend): add Navbar with scroll effect and mobile menu"
```

---

### Task 9: Footer Component

**Files:**
- Create: `frontend/src/components/layout/Footer.tsx`

- [ ] **Step 1: Create Footer component**

```tsx
import Link from "next/link";
import Logo from "@/components/shared/Logo";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <Logo size="lg" />
            <p className="mt-2 text-sm text-white/70 max-w-xs">
              Bangladesh&apos;s premier tuition marketplace connecting guardians with verified, qualified tutors.
            </p>
          </div>

          {/* For Tutors */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">For Tutors</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/register" className="text-sm text-white/60 hover:text-white transition-colors">Become a Tutor</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/faq" className="text-sm text-white/60 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* For Guardians */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">For Guardians</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/tutors" className="text-sm text-white/60 hover:text-white transition-colors">Find a Tutor</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/safety" className="text-sm text-white/60 hover:text-white transition-colors">Safety Tips</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-white/60">support@tuitionhub.com</li>
              <li className="text-sm text-white/60">Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} TuitionHub BD. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify build**

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/layout/Footer.tsx
git commit -m "feat(frontend): add Footer with 4-column layout"
```

---

### Task 10: AuthLayout Component

**Files:**
- Create: `frontend/src/components/layout/AuthLayout.tsx`
- Create: `frontend/src/app/(auth)/layout.tsx`

- [ ] **Step 1: Create AuthLayout component**

```tsx
import { ReactNode } from "react";
import Logo from "@/components/shared/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-[#003320] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo size="lg" className="text-white" />
        </div>
        <div className="rounded-xl bg-white p-6 shadow-lg sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create auth route layout**

```tsx
import AuthLayout from "@/components/layout/AuthLayout";

export default function AuthRouteLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
```

- [ ] **Step 3: Verify build**

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/layout/AuthLayout.tsx frontend/src/app/\(auth\)/layout.tsx
git commit -m "feat(frontend): add AuthLayout with green gradient background"
```

---

### Task 11: Landing Page Sections (Hero, Features, Stats, HowItWorks, Testimonials, CTA)

**Files:**
- Create: `frontend/src/components/sections/HeroSection.tsx`
- Create: `frontend/src/components/sections/FeatureSection.tsx`
- Create: `frontend/src/components/sections/StatsSection.tsx`
- Create: `frontend/src/components/sections/HowItWorksSection.tsx`
- Create: `frontend/src/components/sections/TestimonialSection.tsx`
- Create: `frontend/src/components/sections/CTASection.tsx`

- [ ] **Step 1: Create HeroSection**

```tsx
"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-[#003320] overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Find Your Perfect{" "}
          <span className="text-[#FF6B6B]">Tuition</span>
          {" "}in Bangladesh
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-lg text-white/70 sm:text-xl max-w-2xl mx-auto"
        >
          Connecting guardians with verified, qualified tutors across Dhaka and all divisions of Bangladesh.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/register">
            <Button variant="cta" size="lg">
              Find a Tutor
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Become a Tutor
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ duration: 2, delay: 1, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <svg className="h-8 w-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Create FeatureSection**

```tsx
import { motion } from "motion/react";
import Card from "@/components/ui/Card";

const features = [
  {
    title: "Verified Tutors",
    desc: "Background-checked, qualified educators near you",
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Smart Matching",
    desc: "AI-powered tutor recommendations based on your needs",
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    desc: "Safe, escrow-protected tuition fee transactions",
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

export default function FeatureSection() {
  return (
    <section className="bg-ivory py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900">Why Choose TuitionHub BD?</h2>
          <p className="mt-2 text-neutral-500 max-w-lg mx-auto">
            We make finding the perfect tutor simple, safe, and stress-free.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card variant="interactive" className="border-l-4 border-l-primary h-full">
                <div className="mb-4 rounded-lg bg-primary-light p-3 w-fit">{f.icon}</div>
                <h3 className="text-lg font-semibold text-neutral-900">{f.title}</h3>
                <p className="mt-1 text-sm text-neutral-500">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create StatsSection**

```tsx
"use client";

import { motion } from "motion/react";

const stats = [
  { value: "500+", label: "Qualified Tutors" },
  { value: "1000+", label: "Students Matched" },
  { value: "50+", label: "Areas Covered" },
  { value: "98%", label: "Satisfaction Rate" },
];

export default function StatsSection() {
  return (
    <section className="bg-primary-light py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: i * 0.1 }}
                className="text-4xl font-extrabold text-primary sm:text-5xl"
              >
                {s.value}
              </motion.div>
              <div className="mt-1 text-sm text-neutral-600">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create HowItWorksSection**

```tsx
"use client";

import { motion } from "motion/react";

const steps = [
  { number: 1, title: "Create an Account", desc: "Sign up as a tutor or guardian in under 2 minutes." },
  { number: 2, title: "Find or Post", desc: "Browse verified tutors or post a tuition request." },
  { number: 3, title: "Connect & Verify", desc: "Chat, schedule interviews, and verify credentials." },
  { number: 4, title: "Start Learning", desc: "Begin tuition with secure payment protection." },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-neutral-900">How It Works</h2>
        <p className="mt-2 text-center text-neutral-500 max-w-lg mx-auto">
          Four simple steps to find your perfect match.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="relative text-center"
            >
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-primary/30" />
              )}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">{step.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create TestimonialSection**

```tsx
"use client";

import { motion } from "motion/react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";

const testimonials = [
  {
    name: "Fatima Rahman",
    role: "Guardian, Dhaka",
    quote: "Finding a qualified tutor for my daughter was so easy. The verification process gave me peace of mind.",
    initials: "FR",
  },
  {
    name: "Rafiq Hasan",
    role: "Tutor, Uttara",
    quote: "I've found 3 tuition jobs in my first month. The platform connects me with families who actually need my subjects.",
    initials: "RH",
  },
  {
    name: "Nusrat Jahan",
    role: "Guardian, Gulshan",
    quote: "The matching algorithm found a tutor perfectly suited for my son's needs. Highly recommend!",
    initials: "NJ",
  },
];

export default function TestimonialSection() {
  return (
    <section className="bg-ivory py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-neutral-900">What Our Users Say</h2>
        <p className="mt-2 text-center text-neutral-500 max-w-lg mx-auto">
          Real stories from real users across Bangladesh.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="border-l-4 border-l-primary h-full">
                <p className="text-sm text-neutral-600 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar name={t.name} size="md" />
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">{t.name}</div>
                    <div className="text-xs text-neutral-500">{t.role}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Create CTASection**

```tsx
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to Get Started?
        </h2>
        <p className="mt-3 text-lg text-white/70">
          Join thousands of tutors and guardians across Bangladesh already using TuitionHub BD.
        </p>
        <div className="mt-8">
          <Link href="/register">
            <Button variant="cta" size="lg">
              Join TuitionHub Today
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Verify build**

- [ ] **Step 8: Commit**

```bash
git add frontend/src/components/sections/
git commit -m "feat(frontend): add all landing page sections (hero, features, stats, how-it-works, testimonials, cta)"
```

---

### Task 12: Redesign Landing Page

**Files:**
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Rewrite landing page**

```tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FeatureSection from "@/components/sections/FeatureSection";
import StatsSection from "@/components/sections/StatsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import CTASection from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeatureSection />
        <StatsSection />
        <HowItWorksSection />
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run build**

```bash
cd frontend && npm run build 2>&1 | tail -15
```
Expected: clean build, no errors

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/page.tsx
git commit -m "feat(frontend): redesign landing page with full sections"
```

---

### Task 13: Redesign Login Page

**Files:**
- Modify: `frontend/src/app/(auth)/login/page.tsx`

- [ ] **Step 1: Rewrite login page**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, storeTokens, ApiError } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authApi.login({ email, password });
      storeTokens(result);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-neutral-900">Welcome Back</h1>
        <p className="mt-1 text-sm text-neutral-500">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-cta-light px-4 py-3 text-sm text-cta">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <Button type="submit" loading={loading} className="w-full">
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\(auth\)/login/page.tsx
git commit -m "feat(frontend): redesign login page with new Input component"
```

---

### Task 14: Redesign Register Page

**Files:**
- Modify: `frontend/src/app/(auth)/register/page.tsx`
- Create: `frontend/src/components/sections/RoleSelector.tsx`

- [ ] **Step 1: Create RoleSelector**

```tsx
interface RoleSelectorProps {
  value: "tutor" | "guardian";
  onChange: (role: "tutor" | "guardian") => void;
}

export default function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="flex rounded-lg border border-neutral-200 p-1 bg-neutral-100">
      <button
        onClick={() => onChange("guardian")}
        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
          value === "guardian"
            ? "bg-white text-primary shadow-sm"
            : "text-neutral-500 hover:text-neutral-700"
        }`}
      >
        I&apos;m a Guardian
      </button>
      <button
        onClick={() => onChange("tutor")}
        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
          value === "tutor"
            ? "bg-white text-primary shadow-sm"
            : "text-neutral-500 hover:text-neutral-700"
        }`}
      >
        I&apos;m a Tutor
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite register page**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, storeTokens, ApiError } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import RoleSelector from "@/components/sections/RoleSelector";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"tutor" | "guardian">("guardian");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authApi.register({
        email,
        password,
        fullName,
        phone: phone || undefined,
      });
      storeTokens(result);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-neutral-900">Create Account</h1>
        <p className="mt-1 text-sm text-neutral-500">Join TuitionHub BD today</p>
      </div>

      <RoleSelector value={role} onChange={setRole} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-cta-light px-4 py-3 text-sm text-cta">
            {error}
          </div>
        )}

        <Input
          label="Full Name"
          type="text"
          required
          minLength={2}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
        />

        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <Input
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+8801XXXXXXXXX"
          helper="Optional, but recommended for verification"
        />

        <Input
          label="Password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />

        <Button type="submit" loading={loading} className="w-full">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/\(auth\)/register/page.tsx frontend/src/components/sections/RoleSelector.tsx
git commit -m "feat(frontend): redesign register page with role selector"
```

---

### Task 15: Sidebar + AppShell Layout

**Files:**
- Create: `frontend/src/components/layout/Sidebar.tsx`
- Create: `frontend/src/components/layout/AppShell.tsx`
- Create: `frontend/src/app/(dashboard)/layout.tsx`

- [ ] **Step 1: Create Sidebar**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/shared/Logo";
import Button from "@/components/ui/Button";
import { clearTokens } from "@/lib/api";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/tutors", label: "Find Tutors", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { href: "/requests", label: "My Requests", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/messages", label: "Messages", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  { href: "/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearTokens();
    router.push("/");
  }

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-60 flex-col bg-primary-dark text-white">
      <div className="flex h-16 items-center px-6 border-b border-white/10">
        <Logo size="sm" className="text-white" />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-white/60 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create AppShell**

```tsx
import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />
      <main className="ml-60 flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Create dashboard route layout**

```tsx
import AppShell from "@/components/layout/AppShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
```

- [ ] **Step 4: Verify build**

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/layout/Sidebar.tsx frontend/src/components/layout/AppShell.tsx frontend/src/app/\(dashboard\)/layout.tsx
git commit -m "feat(frontend): add Sidebar, AppShell, and dashboard layout"
```

---

### Task 16: Redesign Dashboard Page

**Files:**
- Modify: `frontend/src/app/(dashboard)/dashboard/page.tsx`

- [ ] **Step 1: Rewrite dashboard page**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

const stats = [
  { label: "Active Applications", value: "3", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Unread Messages", value: "5", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  { label: "Profile Views", value: "28", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "Saved Tutors", value: "7", icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" },
];

const quickActions = [
  { title: "Post a Tuition", desc: "Create a new tuition request", href: "/requests/new", variant: "cta" as const },
  { title: "Find Tutors", desc: "Search qualified tutors near you", href: "/tutors", variant: "primary" as const },
  { title: "Messages", desc: "Check your conversations", href: "/messages", variant: "outline" as const },
];

const recentActivity = [
  { text: "You posted a new tuition request", time: "2 hours ago" },
  { text: "Tutor Rahman replied to your message", time: "5 hours ago" },
  { text: "Your profile was viewed 3 times", time: "1 day ago" },
  { text: "New tutor matched your criteria", time: "2 days ago" },
];

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-neutral-500">Welcome back to TuitionHub BD.</p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-light p-2.5">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900">{s.value}</div>
                <div className="text-xs text-neutral-500">{s.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="mt-10 mb-4 text-lg font-semibold text-neutral-900">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {quickActions.map((a) => (
          <Link key={a.title} href={a.href}>
            <Card variant="interactive">
              <h3 className="font-semibold text-neutral-900">{a.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{a.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <h2 className="mt-10 mb-4 text-lg font-semibold text-neutral-900">Recent Activity</h2>
      <Card>
        <div className="divide-y divide-neutral-100">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <p className="text-sm text-neutral-700">{a.text}</p>
              <span className="shrink-0 text-xs text-neutral-400">{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\(dashboard\)/dashboard/page.tsx
git commit -m "feat(frontend): redesign dashboard with stats grid, quick actions, activity feed"
```

---

### Task 17: Final Build Verification + Housekeeping

- [ ] **Step 1: Full build check**

```bash
cd frontend && npm run build 2>&1
```
Expected: Compiled successfully, 0 errors

- [ ] **Step 2: Lint check**

```bash
cd frontend && npm run lint 2>&1
```

- [ ] **Step 3: Commit remaining files**

```bash
git add -A
git commit -m "chore(frontend): final cleanup and build verification"
```
