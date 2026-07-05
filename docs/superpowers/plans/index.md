# TuitionHub BD — Implementation Plan Index

> **Master index for all 8 build phases.** Each phase is a separate plan file with TDD cycles, exact file paths, and step-by-step instructions.

## Phase 1: Foundation (Weeks 1-2)
**Plan:** `2026-07-05-phase1-foundation.md`

Git setup → Docker Compose → Clean Architecture scaffolding → Auth (Register/Login/Refresh, TDD) → Next.js 15 + PWA → AI service skeleton → CI/CD → Database migrations

## Phase 2: Profiles & Verification (Weeks 3-4)
**Status:** Not yet written

User profiles CRUD (TDD) → Tutor profile with academic info → Document upload/storage → Guardian verification (phone OTP + NID) → Admin verification workflow → Profile + document UI

## Phase 3: Marketplace + Payments (Weeks 5-6)
**Status:** Not yet written

Tuition posts CRUD (TDD) → Apply/Shortlist/Hire workflow → Fuzzy search (pg_trgm, English + Bangla) → bKash/Nagad integration → Commission calculation → Payment transactions → Job browsing UI

## Phase 4: AI Matching Engine (Weeks 7-8)
**Status:** Not yet written

Rule-based matching engine (TDD) → Configurable scoring weights → Salary prediction (LinearRegression) → Fraud detection (Isolation Forest) → Trust score engine → Recommendation UI

## Phase 5: Communication (Weeks 9-10)
**Status:** Not yet written

SignalR chat (TDD) → Real-time messaging → Multi-factor reviews → Complaint workflow → Notification system (in-app + push) → Chat UI

## Phase 6: Admin Panel (Weeks 11-12)
**Status:** Not yet written

Super/Sub Admin dashboards (TDD) → User management → Document verification queue → Financial reports → Audit log viewer → Admin UI

## Phase 7: Monetization (Weeks 13-14)
**Status:** Not yet written

BDT 500 registration fee gate (TDD) → Premium Verified Badge workflow → Featured posts → Ad placements → Revenue dashboard → Monetization UI

## Phase 8: Production Readiness (Weeks 15-16)
**Status:** Not yet written

Security audit (OWASP Top 10) → Load testing (k6) → E2E tests (Playwright) → Bangla search QA → PWA testing → Staging deploy → Documentation → Production launch
