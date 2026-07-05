import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Shield, Zap, Lock, GraduationCap, ArrowRight, Star } from "lucide-react";

const features = [
  { icon: Shield, title: "Verified Tutors", desc: "Background-checked, qualified educators near you" },
  { icon: Zap, title: "Smart Matching", desc: "AI-powered tutor recommendations based on your needs" },
  { icon: Lock, title: "Secure Payments", desc: "Safe, escrow-protected tuition fee transactions" },
];
const stats = [
  { value: "500+", label: "Qualified Tutors" }, { value: "1,000+", label: "Students Matched" },
  { value: "50+", label: "Areas Covered" }, { value: "98%", label: "Satisfaction Rate" },
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
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center sm:py-32">
            <Badge variant="secondary" className="mb-4">Now live across Dhaka</Badge>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Find Your Perfect <span className="text-primary">Tuition</span> in Bangladesh</h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">Connecting guardians with verified, qualified tutors across Dhaka and all divisions.</p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <Link href="/register"><Button size="lg" className="gap-2">Find a Tutor <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/register"><Button variant="outline" size="lg">Become a Tutor</Button></Link>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold">Why Choose TuitionHub?</h2><p className="mt-2 text-muted-foreground">Simple, safe, and stress-free tutoring.</p></div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="hover:border-primary/30 transition-colors">
                <CardHeader><div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-2"><Icon className="h-6 w-6 text-primary" /></div><CardTitle>{title}</CardTitle><CardDescription>{desc}</CardDescription></CardHeader>
              </Card>
            ))}
          </div>
        </section>
        <section className="border-y bg-primary/5 py-16">
          <div className="container mx-auto grid grid-cols-2 gap-8 px-4 lg:grid-cols-4">
            {stats.map(({ value, label }) => (<div key={label} className="text-center"><div className="text-4xl font-extrabold text-primary">{value}</div><div className="mt-1 text-sm text-muted-foreground">{label}</div></div>))}
          </div>
        </section>
        <section id="how-it-works" className="container mx-auto px-4 py-20">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold">How It Works</h2><p className="mt-2 text-muted-foreground">Four simple steps to find your perfect match.</p></div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ num, title, desc }, i) => (
              <div key={num} className="relative text-center">
                {i < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-primary/20" />}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">{num}</div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="border-y bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12"><h2 className="text-3xl font-bold">What Our Users Say</h2><p className="mt-2 text-muted-foreground">Real stories from across Bangladesh.</p></div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map(({ name, role, quote }) => (
                <Card key={name} className="border-l-4 border-l-primary"><CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">{Array(5).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                  <p className="text-sm text-muted-foreground italic">&ldquo;{quote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3"><Avatar><AvatarFallback>{name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar><div><div className="text-sm font-semibold">{name}</div><div className="text-xs text-muted-foreground">{role}</div></div></div>
                </CardContent></Card>
              ))}
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-20">
          <Card className="bg-primary text-primary-foreground border-0"><CardContent className="flex flex-col items-center gap-4 py-16 text-center"><h2 className="text-3xl font-bold">Ready to Get Started?</h2><p className="max-w-md text-primary-foreground/80">Join thousands of tutors and guardians across Bangladesh.</p><Link href="/register"><Button variant="secondary" size="lg" className="gap-2">Join TuitionHub Today <ArrowRight className="h-4 w-4" /></Button></Link></CardContent></Card>
        </section>
      </main>
      <footer className="border-t bg-sidebar text-sidebar-foreground"><div className="container mx-auto px-4 py-12"><div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"><div><div className="flex items-center gap-2 font-bold text-lg mb-2"><GraduationCap className="h-5 w-5" /><span className="text-primary">Tuition</span><span className="text-destructive">Hub</span></div><p className="text-sm text-sidebar-foreground/70">Bangladesh&apos;s premier tuition marketplace.</p></div>{["For Tutors","For Guardians","Contact"].map(h=><div key={h}><h3 className="text-sm font-semibold uppercase tracking-wider mb-3">{h}</h3><ul className="space-y-2 text-sm text-sidebar-foreground/60">{h==="Contact"?<><li>support@tuitionhub.com</li><li>Dhaka, Bangladesh</li></>:<><li><Link href="/register" className="hover:text-sidebar-foreground">Get Started</Link></li><li><Link href="/tutors" className="hover:text-sidebar-foreground">Browse Tutors</Link></li></>}</ul></div>)}</div><div className="mt-10 border-t border-sidebar-border pt-6 text-center text-sm text-sidebar-foreground/40">&copy; {new Date().getFullYear()} TuitionHub BD.</div></div></footer>
    </>
  );
}
