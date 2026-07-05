"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/api";
import { Menu, X, GraduationCap } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const authed = isAuthenticated();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-primary">Tuition</span><span className="text-destructive">Hub</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/tutors" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Find Tutors</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How It Works</Link>
          {authed ? (
            <Link href="/dashboard"><Button size="sm">Dashboard</Button></Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link href="/register"><Button size="sm">Get Started</Button></Link>
            </div>
          )}
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      {mobileOpen && (
        <div className="border-t bg-background px-4 py-4 md:hidden space-y-3">
          <Link href="/tutors" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Find Tutors</Link>
          <Link href="#how-it-works" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>How It Works</Link>
          {authed ? (
            <Link href="/dashboard" onClick={() => setMobileOpen(false)}><Button size="sm" className="w-full">Dashboard</Button></Link>
          ) : (
            <div className="space-y-2">
              <Link href="/login" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm" className="w-full">Sign In</Button></Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}><Button size="sm" className="w-full">Get Started</Button></Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
