"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, storeTokens, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"tutor"|"guardian">("guardian");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try { const r = await authApi.register({ email, password, fullName, phone: phone||undefined, role }); storeTokens(r); router.push("/dashboard"); }
    catch (err) { setError(err instanceof ApiError ? err.message : "Registration failed"); }
    finally { setLoading(false); }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/5 to-background px-4 py-12">
      <Card className="w-full max-w-sm border-2 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2"><GraduationCap className="h-10 w-10 text-primary" /></div>
          <CardTitle className="text-2xl" style={{ fontFamily: '"Playfair Display", serif' }}>Create Account</CardTitle>
          <CardDescription>Join TuitionHub BD today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex rounded-lg border p-1 mb-4 bg-muted">
            <button type="button" onClick={()=>setRole("guardian")} className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${role==="guardian"?"bg-background text-primary shadow-sm":"text-muted-foreground"}`}>I&apos;m a Guardian</button>
            <button type="button" onClick={()=>setRole("tutor")} className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${role==="tutor"?"bg-background text-primary shadow-sm":"text-muted-foreground"}`}>I&apos;m a Tutor</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
            <div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" type="text" required minLength={2} value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Your full name" /></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" /></div>
            <div className="space-y-2"><Label htmlFor="phone">Phone (optional)</Label><Input id="phone" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+8801XXXXXXXXX" /></div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading?"Creating account…":"Create Account"}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link></p>
        </CardContent>
      </Card>
    </div>
  );
}
