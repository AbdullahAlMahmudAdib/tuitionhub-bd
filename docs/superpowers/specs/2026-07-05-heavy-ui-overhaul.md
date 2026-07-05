# Heavy UI Overhaul — TuitionHub BD

## Goal
Transform the current minimal/flat shadcn/ui design into a **heavy, premium UI** with rich backgrounds, scroll animations, carousels, and Playfair Display typography — while keeping the teal OKLCH color palette.

## Fonts
- **Headings**: Playfair Display (Google Fonts, weights 600-900)
- **Body**: Inter (already loaded)

## Color (heavier application of existing palette)
| Token | Current | Heavy |
|---|---|---|
| `--background` | `oklch(1 0 0)` | keep — clean canvas |
| `--primary` | `oklch(0.45 0.14 170)` | `oklch(0.40 0.15 170)` — deeper teal |
| `--muted` | `oklch(0.965 0.005 170)` | `oklch(0.92 0.01 170)` — more visible |
| New dark section | — | `oklch(0.18 0.04 170)` for inverted sections |
| Card border | `oklch(0.922 ...)` | thicker/more visible borders |

## Sections — Landing Page Redesign

### Hero
- Keep gradient but make `from-primary/10 to-background` (stronger tint)
- Playfair Display for h1
- Animated background: subtle geometric pattern or gradient mesh
- CTA buttons get hover glow animation

### Features (3 cards)
- Cards get: visible border, shadow, hover-lift effect (motion `whileHover`)
- Staggered GSAP fade-up on scroll
- Icons with pulse/glow on hover

### Stats (4 counters)
- Background becomes **dark inverted section** (`oklch(0.18 0.04 170)`) with white text
- Count-up animation via GSAP on scroll-into-view
- Decorative top/bottom border transitions

### How It Works (4 steps)
- Step circles get animated pulse border
- Connecting dashed line animates on scroll
- Cards staggered reveal

### Testimonials
- **Carousel** (embla-react) — horizontal slide, nav dots, auto-play
- Cards with quote styling (left border accent, italic text)
- Avatar with subtle scale on active slide

### CTA
- Keep primary solid background
- Add subtle pattern overlay
- Button gets scale pulse animation

### Footer
- Keep dark sidebar theme
- Add decorative top divider

## New Dependencies
- `gsap` (scroll animations, count-up)
- `embla-carousel-react` (testimonial carousel)

## Animation Plan
| Element | Animation | Library |
|---|---|---|
| Section scroll entries | Fade-up + translateY | GSAP ScrollTrigger |
| Stats count-up | Animate from 0 to target | GSAP |
| Card hover | Lift + shadow deepen | motion (framer) |
| Button press | Scale 0.95 | motion |
| Testimonials | Horizontal slide + autoplay | embla-carousel |
| How-It-Works steps | Staggered fade-up | GSAP ScrollTrigger |
| Feature icons | Subtle pulse on hover | motion |

## Pages to Modify
1. `src/app/page.tsx` — landing page (heavy)
2. `src/app/globals.css` — theme tokens, Playfair import
3. `src/app/layout.tsx` — font preconnect
4. `src/app/(auth)/**` — lighter touch (font swap + heavier cards)
5. `src/app/(dashboard)/**` — lighter touch

## Out of Scope (this pass)
- 3D elements (deferred)
- Custom cursor (deferred)
- Page transitions (deferred)
