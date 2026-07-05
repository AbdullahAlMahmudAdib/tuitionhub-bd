"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/api";
import Card from "@/components/ui/Card";
import Link from "next/link";

const stats = [
  { label: "Active Applications", value: "3", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Unread Messages", value: "5", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  { label: "Profile Views", value: "28", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "Saved Tutors", value: "7", icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" },
];

const quickActions = [
  { title: "Post a Tuition", desc: "Create a new tuition request", href: "/requests/new" },
  { title: "Find Tutors", desc: "Search qualified tutors near you", href: "/tutors" },
  { title: "Messages", desc: "Check your conversations", href: "/messages" },
];

const recentActivity = [
  { text: "You posted a new tuition request", time: "2 hours ago" },
  { text: "Tutor Rahman replied to your message", time: "5 hours ago" },
  { text: "Your profile was viewed 3 times", time: "1 day ago" },
  { text: "New tutor matched your criteria", time: "2 days ago" },
];

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-neutral-500">Welcome back to TuitionHub BD.</p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-light p-2.5">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900">{s.value}</div>
                <div className="text-xs text-neutral-500">{s.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="mt-10 mb-4 text-lg font-semibold text-neutral-900">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {quickActions.map((a) => (
          <Link key={a.title} href={a.href}>
            <Card variant="interactive">
              <h3 className="font-semibold text-neutral-900">{a.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{a.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <h2 className="mt-10 mb-4 text-lg font-semibold text-neutral-900">Recent Activity</h2>
      <Card>
        <div className="divide-y divide-neutral-100">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <p className="text-sm text-neutral-700">{a.text}</p>
              <span className="shrink-0 text-xs text-neutral-400">{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
