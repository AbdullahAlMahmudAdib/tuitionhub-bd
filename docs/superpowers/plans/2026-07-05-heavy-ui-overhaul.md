# Heavy UI Overhaul Implementation Plan

> **For agentic workers:** Use inline execution with background subagents where tasks are independent.

**Goal:** Transform TuitionHub BD from minimal/flat to heavy premium UI with Playfair Display, GSAP scroll animations, embla carousel, and deeper teal palette.

**Architecture:** Modify existing pages in-place — no new routes. GSAP ScrollTrigger handles scroll reveals/count-ups. embla-carousel-react handles testimonial slider. motion (already installed) handles micro-interactions.

**Tech Stack:** Next.js 16, Tailwind v4, motion (v12), GSAP (new), embla-carousel-react (new), Playfair Display (new)

**Spec:** `docs/superpowers/specs/2026-07-05-heavy-ui-overhaul.md`

## Global Constraints

- Keep all existing functionality and data — visual changes only
- All 55 Playwright tests must pass after completion
- Mobile-first responsive — animations degrade gracefully
- `prefers-reduced-motion` respected
- No new pages or routes
- Color palette stays teal/OKLCH — just applied heavier

---

### Task 1: Install dependencies & Playfair font

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/src/app/layout.tsx`

**Interfaces:** Foundation — all later tasks depend on these being installed.

- [ ] **Step 1: Install GSAP + embla-carousel-react**

```bash
npm install gsap embla-carousel-react embla-carousel-autoplay
```

Run: `npm ls gsap embla-carousel-react` — should show versions without errors.

- [ ] **Step 2: Add Playfair Display font to layout.tsx**

```tsx
// frontend/src/app/layout.tsx — add to <head> after Inter link
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
```

- [ ] **Step 3: Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/src/app/layout.tsx
git commit -m "feat: install GSAP, embla-carousel, Playfair Display font"
```

---

### Task 2: Update globals.css with heavy theme tokens

**Files:**
- Modify: `frontend/src/app/globals.css`

**Interfaces:** Consumes Task 1 (font loaded). Produces theme tokens consumed by all pages.

- [ ] **Step 1: Add Playfair Display to `@theme inline` block**

```css
/* Add inside @theme inline { ... } */
--font-heading: "Playfair Display", serif;
```

- [ ] **Step 2: Update color tokens for heavier feel**

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.40 0.15 170);       /* deeper teal */
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.965 0.015 170);
  --secondary-foreground: oklch(0.30 0.12 170);
  --muted: oklch(0.92 0.01 170);          /* more visible */
  --muted-foreground: oklch(0.50 0.025 170);
  --accent: oklch(0.92 0.015 170);
  --accent-foreground: oklch(0.30 0.12 170);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.85 0.015 170);        /* darker border */
  --input: oklch(0.85 0.015 170);
  --ring: oklch(0.40 0.15 170);
  --radius: 0.75rem;

  /* Dark section for inverted backgrounds */
  --section-dark: oklch(0.16 0.04 170);
  --section-dark-foreground: oklch(0.95 0.01 170);
  --section-dark-muted: oklch(0.55 0.03 170);

  --sidebar: oklch(0.16 0.04 170);
  --sidebar-foreground: oklch(0.95 0.01 170);
  --sidebar-primary: oklch(0.40 0.15 170);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.22 0.04 170);
  --sidebar-accent-foreground: oklch(0.95 0.01 170);
  --sidebar-border: oklch(0.22 0.04 170);
  --sidebar-ring: oklch(0.40 0.15 170);
}
```

- [ ] **Step 3: Add motion-safe utility and heading font utility**

```css
@layer base {
  * { @apply border-border outline-ring/50; }
  body {
    @apply bg-background text-foreground;
    font-family: "Inter", sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: "Playfair Display", serif;
    font-weight: 700;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/globals.css
git commit -m "feat: heavy theme tokens in globals.css — deeper teal, section-dark, Playfair heading"
```

---

### Task 3: Build reusable animation hooks

**Files:**
- Create: `frontend/src/lib/animations.ts`

**Interfaces:** Consumed by all pages needing GSAP scroll animations.

- [ ] **Step 1: Create animations utility**

```typescript
// frontend/src/lib/animations.ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Fade up on scroll — apply to any element ref */
export function useScrollFadeUp(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(el, { opacity: 0, y: 40 });
    const st = ScrollTrigger.create({
      trigger: el,
      start: `top bottom+=${(1 - threshold) * 100}%`,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }),
      once: true,
    });

    return () => st.kill();
  }, [threshold]);

  return ref;
}

/** Stagger fade-up for children */
export function useStaggerFadeUp(threshold = 0.2, stagger = 0.1) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const children = el.children;
    if (!children.length) return;

    gsap.set(children, { opacity: 0, y: 30 });
    const st = ScrollTrigger.create({
      trigger: el,
      start: `top bottom+=${(1 - threshold) * 100}%`,
      onEnter: () => gsap.to(children, { opacity: 1, y: 0, duration: 0.6, stagger, ease: "power2.out" }),
      once: true,
    });

    return () => st.kill();
  }, [threshold, stagger]);

  return ref;
}

/** Count-up animation */
export function useCountUp(end: number, duration = 2) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { if (el) el.textContent = String(end); return; }

    gsap.set(el, { textContent: 0 });
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom+=80%",
      onEnter: () => {
        gsap.to(el, {
          textContent: end,
          duration,
          ease: "power2.out",
          snap: { textContent: 1 },
          onUpdate: () => {
            const val = parseInt(el!.textContent || "0");
            el!.textContent = val.toLocaleString();
          },
        });
      },
      once: true,
    });

    return () => st.kill();
  }, [end, duration]);

  return ref;
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/lib/animations.ts
git commit -m "feat: add GSAP scroll animation hooks — fadeUp, stagger, countUp"
```

---

### Task 4: Rebuild landing page — structure and imports

**Files:**
- Rewrite: `frontend/src/app/page.tsx`

**Interfaces:** Consumes Tasks 1-3. This is the main visual overhaul.

- [ ] **Step 1: Write the full landing page with heavy UI**

```tsx
// frontend/src/app/page.tsx
"use client";

import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { motion } from "motion/react";
import { useScrollFadeUp, useStaggerFadeUp, useCountUp } from "@/lib/animations";
import { Shield, Zap, Lock, GraduationCap, ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const features = [
  { icon: Shield, title: "Verified Tutors", desc: "Background-checked, qualified educators near you" },
  { icon: Zap, title: "Smart Matching", desc: "AI-powered tutor recommendations based on your needs" },
  { icon: Lock, title: "Secure Payments", desc: "Safe, escrow-protected tuition fee transactions" },
];

const statsData = [
  { value: 500, label: "Qualified Tutors", suffix: "+" },
  { value: 1000, label: "Students Matched", suffix: "+" },
  { value: 50, label: "Areas Covered", suffix: "+" },
  { value: 98, label: "Satisfaction Rate", suffix: "%" },
];

const steps = [
  { num: 1, title: "Create Account", desc: "Sign up as a tutor or guardian in under 2 minutes." },
  { num: 2, title: "Find or Post", desc: "Browse verified tutors or post a tuition request." },
  { num: 3, title: "Connect & Verify", desc: "Chat, schedule interviews, and verify credentials." },
  { num: 4, title: "Start Learning", desc: "Begin tuition with secure payment protection." },
];

const testimonials = [
  { name: "Fatima Rahman", role: "Guardian, Dhaka", quote: "Finding a qualified tutor for my daughter was so easy. The verification process gave me peace of mind." },
  { name: "Rafiq Hasan", role: "Tutor, Uttara", quote: "I've found 3 tuition jobs in my first month. The platform connects me with families who actually need my subjects." },
  { name: "Nusrat Jahan", role: "Guardian, Gulshan", quote: "The matching algorithm found a tutor perfectly suited for my son's needs. Highly recommend!" },
  { name: "Kamal Hossain", role: "Tutor, Mirpur", quote: "The payment protection system is excellent. I get paid on time, every time. Highly professional platform." },
  { name: "Tahmina Akter", role: "Guardian, Banani", quote: "My daughter's grades improved dramatically after we found a tutor through TuitionHub. Thank you!" },
];

function StatCard({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const countRef = useCountUp(value);
  return (
    <div className="text-center">
      <div className="text-4xl font-extrabold text-primary-foreground">
        <span ref={countRef}>0</span>{suffix}
      </div>
      <div className="mt-1 text-sm text-section-dark-muted">{label}</div>
    </div>
  );
}

function TestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden -mx-4">
        <div className="flex">
          {testimonials.map((t) => (
            <div key={t.name} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-4">
              <Card className="h-full border-l-4 border-l-primary shadow-md">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">{Array(5).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                  <p className="text-sm text-muted-foreground italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar><AvatarFallback>{t.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                    <div><div className="text-sm font-semibold">{t.name}</div><div className="text-xs text-muted-foreground">{t.role}</div></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <button onClick={scrollPrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 rounded-full bg-background shadow-md border p-2 hover:bg-muted transition-colors"><ChevronLeft className="h-4 w-4" /></button>
      <button onClick={scrollNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 rounded-full bg-background shadow-md border p-2 hover:bg-muted transition-colors"><ChevronRight className="h-4 w-4" /></button>
      <div className="flex justify-center gap-2 mt-4">
        {testimonials.map((_, i) => (<button key={i} onClick={() => emblaApi?.scrollTo(i)} className={`h-2 rounded-full transition-all ${i === selectedIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"}`} />))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const heroRef = useScrollFadeUp(0.4);
  const featuresRef = useStaggerFadeUp(0.3, 0.15);
  const howRef = useStaggerFadeUp(0.3, 0.12);
  const ctaRef = useScrollFadeUp(0.4);

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/10 via-primary/5 to-background">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 25% 50%, currentColor 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
          <div ref={heroRef} className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center sm:py-32 relative">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Badge variant="secondary" className="mb-4">Now live across Dhaka</Badge>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: '"Playfair Display", serif' }}>
              Find Your Perfect <span className="text-primary">Tuition</span> in Bangladesh
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="mt-4 max-w-xl text-lg text-muted-foreground">
              Connecting guardians with verified, qualified tutors across Dhaka and all divisions.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <Link href="/register"><motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Button size="lg" className="gap-2 shadow-lg shadow-primary/25">Find a Tutor <ArrowRight className="h-4 w-4" /></Button></motion.div></Link>
              <Link href="/register"><motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Button variant="outline" size="lg">Become a Tutor</Button></motion.div></Link>
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section ref={featuresRef} className="container mx-auto px-4 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose TuitionHub?</h2>
            <p className="mt-2 text-muted-foreground">Simple, safe, and stress-free tutoring.</p>
          </motion.div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Card className="h-full border-2 hover:border-primary/40 transition-colors shadow-sm hover:shadow-lg">
                  <CardHeader>
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-2">
                      <Icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <CardTitle>{title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* STATS — dark inverted section */}
        <section className="border-y bg-section-dark py-16" style={{ backgroundColor: 'var(--section-dark)' }}>
          <div className="container mx-auto grid grid-cols-2 gap-8 px-4 lg:grid-cols-4">
            {statsData.map((s) => <StatCard key={s.label} {...s} />)}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section ref={howRef} id="how-it-works" className="container mx-auto px-4 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-2 text-muted-foreground">Four simple steps to find your perfect match.</p>
          </motion.div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ num, title, desc }, i) => (
              <motion.div key={num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }} className="relative text-center">
                {i < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-primary/30" />}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/30">{num}</div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS CAROUSEL */}
        <section className="border-y bg-muted/20 py-20">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl font-bold">What Our Users Say</h2>
              <p className="mt-2 text-muted-foreground">Real stories from across Bangladesh.</p>
            </motion.div>
            <TestimonialCarousel />
          </div>
        </section>

        {/* CTA */}
        <section ref={ctaRef} className="container mx-auto px-4 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, white 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
            <div className="relative flex flex-col items-center gap-4 px-8 py-16 text-center">
              <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
              <p className="max-w-md text-primary-foreground/80">Join thousands of tutors and guardians across Bangladesh.</p>
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="secondary" size="lg" className="gap-2 shadow-lg">
                    Join TuitionHub Today <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t bg-sidebar text-sidebar-foreground" style={{ backgroundColor: 'var(--section-dark)' }}>
        <div className="container mx-auto px-4 py-12">
          {/* decorative top border */}
          <div className="mb-8 h-1 w-20 rounded-full bg-primary/50" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="text-primary">Tuition</span><span className="text-destructive">Hub</span>
              </div>
              <p className="text-sm text-sidebar-foreground/70">Bangladesh&apos;s premier tuition marketplace.</p>
            </div>
            {["For Tutors","For Guardians","Contact"].map(h => (
              <div key={h}>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">{h}</h3>
                <ul className="space-y-2 text-sm text-sidebar-foreground/60">
                  {h === "Contact" ? (
                    <><li>support@tuitionhub.com</li><li>Dhaka, Bangladesh</li></>
                  ) : (
                    <><li><Link href="/register" className="hover:text-sidebar-foreground transition-colors">Get Started</Link></li><li><Link href="/tutors" className="hover:text-sidebar-foreground transition-colors">Browse Tutors</Link></li></>
                  )}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-sidebar-border pt-6 text-center text-sm text-sidebar-foreground/40">
            &copy; {new Date().getFullYear()} TuitionHub BD.
          </div>
        </div>
      </footer>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/app/page.tsx
git commit -m "feat: heavy UI landing page — GSAP scroll, embla carousel, Playfair headings"
```

---

### Task 5: Update auth pages (login + register) for heavier UI

**Files:**
- Modify: `frontend/src/app/(auth)/login/page.tsx`
- Modify: `frontend/src/app/(auth)/register/page.tsx`

**Interfaces:** Card visuals match new heavy theme (shadow, border).

- [ ] **Step 1: Update login page Card styling**

In `frontend/src/app/(auth)/login/page.tsx`, replace:
```tsx
<Card className="w-full max-w-sm">
```
with:
```tsx
<Card className="w-full max-w-sm border-2 shadow-lg">
```

Update heading to use Playfair inline:
```tsx
<CardTitle className="font-heading" style={{ fontFamily: '"Playfair Display", serif' }}>Welcome Back</CardTitle>
```

- [ ] **Step 2: Update register page Card styling**

In `frontend/src/app/(auth)/register/page.tsx`, replace:
```tsx
<Card className="w-full max-w-sm">
```
with:
```tsx
<Card className="w-full max-w-sm border-2 shadow-lg">
```

Update heading:
```tsx
<CardTitle className="font-heading" style={{ fontFamily: '"Playfair Display", serif' }}>Create Account</CardTitle>
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\(auth\)/login/page.tsx frontend/src/app/\(auth\)/register/page.tsx
git commit -m "feat: heavier auth cards — border, shadow, Playfair headings"
```

---

### Task 6: Run Playwright tests and fix any regressions

**Files:**
- Run: `frontend/` — full test suite
- Fix: any failing tests in `frontend/tests/e2e/`

- [ ] **Step 1: Run full test suite**

```bash
npx playwright test --reporter=list
```

Expected: all 55 tests pass.

If tests fail due to DOM changes:
- Check selector mismatches (new elements, changed text, different structure)
- Fix test selectors to match new DOM
- Re-run until green

- [ ] **Step 2: Commit any test fixes**

```bash
git add frontend/tests/e2e/
git commit -m "fix: update test selectors for heavy UI DOM changes"
```

---

### Task 7: Final commit + push

- [ ] **Step 1: Push to develop**

```bash
git push origin develop
```
