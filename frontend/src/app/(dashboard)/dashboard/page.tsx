"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FileText, MessageSquare, Users, Bookmark, ArrowRight } from "lucide-react";

const stats = [
  { icon: FileText, label: "Active Applications", value: "3" },
  { icon: MessageSquare, label: "Unread Messages", value: "5" },
  { icon: Users, label: "Profile Views", value: "28" },
  { icon: Bookmark, label: "Saved Tutors", value: "7" },
];
const quickActions = [
  { title: "Post a Tuition", desc: "Create a new tuition request", href: "/requests" },
  { title: "Find Tutors", desc: "Search qualified tutors near you", href: "/tutors" },
  { title: "Messages", desc: "Check your conversations", href: "/messages" },
];

export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated()) router.push("/login"); }, [router]);

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-muted-foreground">Welcome back to TuitionHub BD.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label}><CardContent className="flex items-center gap-4 pt-6"><div className="rounded-lg bg-primary/10 p-2.5"><Icon className="h-5 w-5 text-primary" /></div><div><div className="text-2xl font-bold">{value}</div><div className="text-xs text-muted-foreground">{label}</div></div></CardContent></Card>
        ))}
      </div>
      <h2 className="mt-10 mb-4 text-lg font-semibold">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {quickActions.map(({ title, desc, href }) => (
          <Link key={title} href={href}><Card className="hover:border-primary/30 transition-colors cursor-pointer"><CardHeader><CardTitle className="text-base">{title}</CardTitle><p className="text-sm text-muted-foreground">{desc}</p></CardHeader></Card></Link>
        ))}
      </div>
    </div>
  );
}
