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
