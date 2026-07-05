# TuitionHub BD — Frontend Design Spec

> **Phase:** Foundation (Phase 1.5 — Frontend Redesign)
> **Status:** Draft
> **Date:** 2026-07-05
> **Stack:** Next.js 16 + Tailwind CSS v4 + Motion + Serwist PWA

---

## 1. Design Direction: Bangladesh Heritage

A modern, trustworthy marketplace aesthetic rooted in Bangladeshi identity. Green (`#006A4E`) as the primary — symbolizing growth, education, and the lush landscape of Bangladesh. Red (`#DA291C`) reserved for high-energy CTAs and badges — a nod to the national flag. Warm ivory backgrounds soften the contrast, keeping the feel approachable rather than corporate.

### 1.1 Color Palette

```
Primary Green       #006A4E    — Main brand color (buttons, headers, links)
Green Dark          #004D39    — Hover states, active nav
Green Light         #E8F5F0    — Subtle card/background tint
Flag Red            #DA291C    — Primary CTA, premium badges, alerts
Red Light           #FDE8E7    — Error backgrounds, notification tint
Warm Ivory          #FFF8F0    — Page background (soft, warm)
Neutral-900         #1A1A2E    — Headings, primary text
Neutral-700         #334155    — Secondary text
Neutral-500         #64748B    — Body text, captions
Neutral-200         #E2E8F0    — Borders, dividers
Neutral-100         #F1F5F9    — Surface backgrounds
White               #FFFFFF    — Cards, modals, elevated surfaces
```

### 1.2 Typography

| Usage | Font | Weight | Size |
|-------|------|--------|------|
| Hero heading | Inter | 800 (ExtraBold) | 4xl-5xl (36-48px) |
| Section heading | Inter | 700 (Bold) | 2xl-3xl (24-30px) |
| Card title | Inter | 600 (Semibold) | lg-xl (18-20px) |
| Body | Inter | 400 (Regular) | sm-base (14-16px) |
| Small/caption | Inter | 400 | xs-sm (12-14px) |
| Bangla body | Noto Sans Bengali | 400 | base (16px) |

Font stacks in `globals.css`:
```css
--font-heading: 'Inter', 'Noto Sans Bengali', sans-serif;
--font-body: 'Inter', 'Noto Sans Bengali', sans-serif;
```

All font sizes use Tailwind v4's `@theme` tokens.

### 1.3 Spacing & Sizing

4px base unit: `4/8/12/16/20/24/32/40/48/64/80/96/128`

Tailwind v4 uses `@theme` for custom spacing. The default spacing scale covers everything needed.

### 1.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Inputs, small elements |
| `rounded-md` | 8px | Cards, buttons, modals |
| `rounded-lg` | 12px | Large cards, dialogs |
| `rounded-xl` | 16px | Hero sections, containers |
| `rounded-full` | 9999px | Avatars, badges, pills |

### 1.5 Shadows

| Token | Usage |
|-------|-------|
| `shadow-sm` | Card default |
| `shadow-md` | Dropdowns, hovered cards |
| `shadow-lg` | Modals, floating elements |
| `shadow-xl` | Hero overlays, sticky headers |

---

## 2. Component Architecture

```
src/components/
├── ui/               # Shared primitives (atomic)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   ├── Modal.tsx
│   ├── Skeleton.tsx
│   ├── Toast.tsx
│   └── Select.tsx
├── layout/           # Structural shells
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── AuthLayout.tsx
├── sections/         # Page-level sections (organic)
│   ├── HeroSection.tsx
│   ├── FeatureSection.tsx
│   ├── StatsSection.tsx
│   ├── HowItWorksSection.tsx
│   ├── TestimonialSection.tsx
│   ├── CTASection.tsx
│   └── RoleSelector.tsx
└── shared/           # Cross-cutting
    ├── Logo.tsx
    └── ThemeProvider.tsx
```

### 2.1 UI Component Specs

**Button** — `variant: 'primary' | 'cta' | 'outline' | 'ghost' | 'link'`, `size: 'sm' | 'md' | 'lg'`, `loading?: boolean`, `icon?: ReactNode`
- Primary: green bg, white text
- CTA: red bg, white text (for key actions like "Find Tutor")
- Outline: transparent with green border
- Ghost: no bg, no border, green text on hover
- Link: inline text link with underline on hover
- Loading: shows spinner icon, disables interaction

**Input** — `label`, `error`, `helper`, `icon`, `type: 'text' | 'email' | 'password' | 'tel' | 'search'`
- Green focus ring (2px)
- Error state: red border + error text
- Search variant: magnifying glass icon on left

**Card** — `variant: 'default' | 'interactive' | 'bordered'`, `padding: 'sm' | 'md' | 'lg'`
- Default: white bg, `shadow-sm`, `rounded-md`
- Interactive: hover lifts (`shadow-md` + `-translate-y-0.5`)
- Bordered: border instead of shadow

**Badge** — `variant: 'verified' | 'premium' | 'pending' | 'featured' | 'success' | 'warning'`
- Verified: blue/green checkmark
- Premium: red/gold
- Pending: yellow/amber
- Featured: red

**Avatar** — `src?`, `name` (initials fallback), `size: 'sm' | 'md' | 'lg' | 'xl'`, `online?: boolean`
- Shows green dot when online

**Skeleton** — `variant: 'text' | 'circular' | 'rectangular' | 'card'` — pulsing gray placeholder

**Modal** — `open`, `onClose`, `title`, `children`, `size: 'sm' | 'md' | 'lg'`
- Backdrop with blur, close on escape + backdrop click
- Slide-up animation on mobile

**Toast** — `type: 'success' | 'error' | 'info'`, `message`, `duration?` (auto-dismiss)
- Slide-in from top-right on desktop, top-center on mobile

---

## 3. Page Routes & Layouts

| Route | Layout | Auth Required | Purpose |
|-------|--------|---------------|---------|
| `/` | PublicLayout | No | Marketing landing |
| `/login` | AuthLayout | No | Sign in |
| `/register` | AuthLayout | No | Sign up with role select |
| `/dashboard` | AppShell | Yes | User home |
| `/tutors` | AppShell | Yes | Browse tutors |
| `/tutors/[id]` | AppShell | Yes | Tutor profile |
| `/requests` | AppShell | Yes | Tuition requests list |
| `/requests/new` | AppShell | Yes | Post a tuition job |
| `/messages` | AppShell | Yes | Chat (placeholder) |
| `/settings` | AppShell | Yes | Profile & preferences |

### 3.1 Layout Variants

**PublicLayout** — Full-width, no sidebar
- Navbar: transparent on hero, white on scroll (with green bg transition)
- Footer: dark green bg, white text, columns: About / For Tutors / For Guardians / Contact
- Content: max-w-7xl centered

**AuthLayout** — Minimal, centered card
- Green gradient background (full viewport)
- Centered white card with logo, form, footer links
- No navbar, no footer

**AppShell** — Authenticated, sidebar navigation
- Left sidebar: 240px, green-dark bg, white icons + text, active item highlighted
- Top bar: breadcrumb / page title (right side), user avatar + dropdown (left side)
- Content: fills remaining width, max-w-7xl

### 3.2 Page Designs

#### Landing Page (`/`)

**Hero Section (full viewport):**
- Background: gradient `#006A4E → #004D39` with subtle pattern overlay
- Headline: "Find Your Perfect Tutor in Bangladesh" — white, 4xl
- Subtitle: "Connect with verified, qualified tutors near you" — gray-200, lg
- Dual CTAs: "Find a Tutor" (red, lg) | "Become a Tutor" (white outline, lg)
- Optional: floating illustration or stats overlay on right side
- Scroll-down indicator at bottom

**Feature Section:**
- 3-column grid on desktop, stack on mobile
- Icons: Search (magnifying glass), Match (target), Trust (shield check)
- Title + description for each
- Cards: white bg, green left accent border, shadow-sm

**Stats Section:**
- Green-tinted background (`#E8F5F0`)
- 4 stat blocks: "500+ Tutors" / "1000+ Students" / "50+ Areas" / "98% Satisfaction"
- Large numbers (4xl), green color, label below

**How It Works Section:**
- 4-step horizontal process on desktop, vertical on mobile
- Each step: numbered circle (green bg, white number), title, description
- Connecting line between steps (green dashed)

**Testimonials Section:**
- 3 testimonial cards in a horizontal scroll / carousel
- Each: avatar + name + role + quote
- White cards, shadow-sm, border left green

**Final CTA Section:**
- Dark green bg, white text
- "Ready to Get Started?" headline
- Red CTA button: "Join TuitionHub Today"

**Footer:**
- Dark green (`#004D39`) background, white/light text
- 4 columns: Company, For Tutors, For Guardians, Contact
- Bottom bar: copyright, social links, payment partners placeholder

#### Login Page (`/login`)

- Full viewport green gradient background
- Centered white card (max-w-sm)
- Logo at top of card
- Form: email input, password input, "Sign in" button (green, full-width)
- Error message area (red bg, hidden by default)
- Below card: "Don't have an account? Register" link
- Optional: "Forgot password?" link below form

#### Register Page (`/register`)

- Same green gradient background as login
- Role selector at top of card: "I'm a Tutor" | "I'm a Guardian" (pill toggle)
- Form fields: Full Name, Email, Phone (optional), Password, Confirm Password
- "Create Account" button (green, full-width)
- Below card: "Already have an account? Sign in"

#### Dashboard (`/dashboard`)

- AppShell layout with sidebar
- Top greeting: "Welcome back, {Name}" + current date
- Stats row (4 cards): Active Applications, Messages, Profile Views, Saved Tutors
- Recent Activity feed (list with timestamps)
- Quick Action cards: Post a Tuition, Find Tutors, Messages

---

## 4. Motion & Animation

Using the existing `motion` package (Framer Motion v12 successor).

| Element | Animation | Duration | Trigger |
|---------|-----------|----------|---------|
| Page transitions | Fade in + slide up 20px | 300ms | Route change |
| Cards | Scale 1.02 + shadow-md | 200ms | Hover |
| Hero headline | Staggered fade-up (children) | 400ms each | Page load |
| Hero subtitle | Fade in (delay 200ms) | 400ms | Page load |
| CTA buttons | Fade in (delay 400ms) | 300ms | Page load |
| Stats counter | Animate from 0 to target | 1000ms | Scroll into view |
| Modal | Scale 0.95→1 + fade | 200ms | Open/close |
| Toast | Slide in from top-right | 300ms | Show |
| Skeleton | Pulse opacity | 1500ms loop | Loading |
| Sidebar | Slide from left | 250ms | Mobile toggle |
| Navbar | Background solidifies on scroll | 200ms | Scroll past hero |

---

## 5. Responsive Strategy

| Breakpoint | Width | Layout Behavior |
|------------|-------|-----------------|
| Mobile | < 640px | Single column, hamburger nav, stacked cards, bottom nav bar |
| Tablet | 640–1023px | 2-column grids, collapsed sidebar (icons only), card grids 2-col |
| Desktop | 1024px+ | Full sidebar, 3-column grids, max-w-7xl content centering |

Mobile-first approach: all layouts default to mobile, `sm:` / `md:` / `lg:` breakpoints expand upwards.

---

## 6. Bengali/English Bilingual Support

- `<html lang="bn">` — already set
- All UI text in English for Phase 1.5
- Component props accept `lang` or use context for future i18n
- `Noto Sans Bengali` font preloaded for Bangla character rendering
- Placeholders, error messages, labels ready for translation extraction
- No RTL needed (Bangla is LTR script)

---

## 7. PWA Considerations

- Offline fallback page (via Serwist)
- Service worker caches static assets + API responses
- Install prompt for Android Chrome
- Standalone display: no browser chrome
- Splash screen uses theme_color `#006A4E`
- Icon set: 192px and 512px (currently SVGs — needs PNG generation)

---

## 8. File-by-File Implementation Order

This is the build order — each phase builds on the previous.

### Phase A: Foundation (Design System)
1. `frontend/src/app/globals.css` — tailwind theme tokens + fonts
2. `frontend/src/components/ui/Button.tsx`
3. `frontend/src/components/ui/Input.tsx`
4. `frontend/src/components/ui/Card.tsx`
5. `frontend/src/components/ui/Badge.tsx`
6. `frontend/src/components/ui/Avatar.tsx`
7. `frontend/src/components/ui/Skeleton.tsx`
8. `frontend/src/components/ui/Modal.tsx`
9. `frontend/src/components/ui/Toast.tsx`
10. `frontend/src/components/shared/Logo.tsx`

### Phase B: Layout Shells
11. `frontend/src/components/layout/Navbar.tsx` (public variant)
12. `frontend/src/components/layout/Footer.tsx`
13. `frontend/src/components/layout/AuthLayout.tsx`
14. `frontend/src/app/(auth)/layout.tsx` — wrap auth pages

### Phase C: Public Pages
15. `frontend/src/components/sections/HeroSection.tsx`
16. `frontend/src/components/sections/FeatureSection.tsx`
17. `frontend/src/components/sections/StatsSection.tsx`
18. `frontend/src/components/sections/HowItWorksSection.tsx`
19. `frontend/src/components/sections/TestimonialSection.tsx`
20. `frontend/src/components/sections/CTASection.tsx`
21. `frontend/src/app/page.tsx` — landing page (compose sections)
22. `frontend/src/app/globals.css` — motion animation keyframes

### Phase D: Auth Pages
23. `frontend/src/components/sections/RoleSelector.tsx`
24. `frontend/src/app/(auth)/login/page.tsx` — redesign
25. `frontend/src/app/(auth)/register/page.tsx` — redesign

### Phase E: Dashboard & AppShell
26. `frontend/src/components/layout/Sidebar.tsx`
27. `frontend/src/components/layout/AppShell.tsx`
28. `frontend/src/app/(dashboard)/layout.tsx` — wrap dashboard pages
29. `frontend/src/app/(dashboard)/dashboard/page.tsx` — redesign

### Phase F: Polish
30. Motion animations integration
31. Responsive QA pass
32. PWA icon PNGs (generate from SVGs)
