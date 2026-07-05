"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { clearTokens, isAuthenticated } from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  function handleLogout() {
    clearTokens();
    router.push("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <span className="text-lg font-bold text-primary-600">TuitionHub BD</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Guardian</span>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-gray-500">Welcome to TuitionHub BD.</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Find Tutors", desc: "Search for qualified tutors near you", href: "#" },
            { title: "My Requests", desc: "View and manage tuition requests", href: "#" },
            { title: "Messages", desc: "Chat with tutors and guardians", href: "#" },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-xl border bg-white p-6 shadow-xs transition hover:shadow-md"
            >
              <h3 className="font-semibold text-gray-900">{card.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{card.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
