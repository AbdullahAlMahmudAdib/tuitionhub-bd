"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/api";
import Card from "@/components/ui/Card";

export default function RequestsPage() {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">My Requests</h1>
        <p className="text-neutral-500">Manage your tuition requests and applications.</p>
      </div>
      <Card className="text-center py-16">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-neutral-700">Coming in Phase 3</h2>
        <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto">
          Post tuition requests, review applications, and manage your jobs — all coming soon.
        </p>
      </Card>
    </div>
  );
}
