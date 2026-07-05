"use client";

import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { motion } from "motion/react";
import { useScrollFadeUp, useStaggerFadeUp, useCountUp } from "@/lib/animations";
import {
  Shield,
  Zap,
  Lock,
  GraduationCap,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  {
    name: "Fatima Rahman",
    role: "Guardian, Dhaka",
    quote:
      "Finding a qualified tutor for my daughter was so easy. The verification process gave me peace of mind.",
  },
  {
    name: "Rafiq Hasan",
    role: "Tutor, Uttara",
    quote:
      "I've found 3 tuition jobs in my first month. The platform connects me with families who actually need my subjects.",
  },
  {
    name: "Nusrat Jahan",
    role: "Guardian, Gulshan",
    quote:
      "The matching algorithm found a tutor perfectly suited for my son's needs. Highly recommend!",
  },
  {
    name: "Kamal Hossain",
    role: "Tutor, Mirpur",
    quote:
      "The payment protection system is excellent. I get paid on time, every time. Highly professional platform.",
  },
  {
    name: "Tahmina Akter",
    role: "Guardian, Banani",
    quote:
      "My daughter's grades improved dramatically after we found a tutor through TuitionHub. Thank you!",
  },
];

function StatCard({
  value,
  label,
  suffix,
}: {
  value: number;
  label: string;
  suffix: string;
}) {
  const countRef = useCountUp(value);
  return (
    <div className="text-center">
      <div className="text-4xl font-extrabold" style={{ color: "var(--primary-foreground)" }}>
        <span ref={countRef}>0</span>
        {suffix}
      </div>
      <div className="mt-1 text-sm" style={{ color: "var(--section-dark-muted)" }}>
        {label}
      </div>
    </div>
  );
}

function TestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden -mx-4">
        <div className="flex">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-4"
            >
              <Card className="h-full border-l-4 border-l-primary shadow-md">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {t.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 rounded-full bg-background shadow-md border p-2 hover:bg-muted transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 rounded-full bg-background shadow-md border p-2 hover:bg-muted transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <div className="flex justify-center gap-2 mt-4">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === selectedIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
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
        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/10 via-primary/5 to-background">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 50%, currentColor 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
            aria-hidden="true"
          />
          <div
            ref={heroRef}
            className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center sm:py-32 relative"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="secondary" className="mb-4">
                Now live across Dhaka
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Find Your Perfect{" "}
              <span className="text-primary">Tuition</span> in Bangladesh
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-4 max-w-xl text-lg text-muted-foreground"
            >
              Connecting guardians with verified, qualified tutors across Dhaka and all divisions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
            >
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="gap-2 shadow-lg" style={{ boxShadow: "0 4px 24px rgba(0,128,96,0.3)" }}>
                    Find a Tutor <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg">
                    Become a Tutor
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section
          ref={featuresRef}
          className="container mx-auto px-4 py-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold">Why Choose TuitionHub?</h2>
            <p className="mt-2 text-muted-foreground">Simple, safe, and stress-free tutoring.</p>
          </motion.div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="h-full border-2 hover:border-primary/40 transition-colors shadow-sm hover:shadow-lg">
                  <CardHeader>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-2"
                    >
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

        {/* ─── STATS (dark inverted section) ─── */}
        <section
          className="border-y py-16"
          style={{ backgroundColor: "var(--section-dark)" }}
        >
          <div className="container mx-auto grid grid-cols-2 gap-8 px-4 lg:grid-cols-4">
            {statsData.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section
          ref={howRef}
          id="how-it-works"
          className="container mx-auto px-4 py-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-2 text-muted-foreground">
              Four simple steps to find your perfect match.
            </p>
          </motion.div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative text-center"
              >
                {i < 3 && (
                  <div
                    className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed"
                    style={{ borderColor: "color-mix(in oklch, var(--primary) 30%, transparent)" }}
                    aria-hidden="true"
                  />
                )}
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground"
                  style={{ boxShadow: "0 4px 20px rgba(0,128,96,0.3)" }}
                >
                  {num}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── TESTIMONIALS CAROUSEL ─── */}
        <section className="border-y bg-muted/20 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold">What Our Users Say</h2>
              <p className="mt-2 text-muted-foreground">
                Real stories from across Bangladesh.
              </p>
            </motion.div>
            <TestimonialCarousel />
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section
          ref={ctaRef}
          className="container mx-auto px-4 py-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground"
          >
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, white 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-center gap-4 px-8 py-16 text-center">
              <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
              <p className="max-w-md text-primary-foreground/80">
                Join thousands of tutors and guardians across Bangladesh.
              </p>
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="gap-2 shadow-lg"
                  >
                    Join TuitionHub Today <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer
        className="border-t text-sidebar-foreground"
        style={{ backgroundColor: "var(--section-dark)" }}
      >
        <div className="container mx-auto px-4 py-12">
          <div
            className="mb-8 h-1 w-20 rounded-full"
            style={{ backgroundColor: "color-mix(in oklch, var(--primary) 50%, transparent)" }}
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="text-primary">Tuition</span>
                <span className="text-destructive">Hub</span>
              </div>
              <p className="text-sm text-sidebar-foreground/70">
                Bangladesh&apos;s premier tuition marketplace.
              </p>
            </div>
            {["For Tutors", "For Guardians", "Contact"].map((h) => (
              <div key={h}>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
                  {h}
                </h3>
                <ul className="space-y-2 text-sm text-sidebar-foreground/60">
                  {h === "Contact" ? (
                    <>
                      <li>support@tuitionhub.com</li>
                      <li>Dhaka, Bangladesh</li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link href="/register" className="hover:text-sidebar-foreground transition-colors">
                          Get Started
                        </Link>
                      </li>
                      <li>
                        <Link href="/tutors" className="hover:text-sidebar-foreground transition-colors">
                          Browse Tutors
                        </Link>
                      </li>
                    </>
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
