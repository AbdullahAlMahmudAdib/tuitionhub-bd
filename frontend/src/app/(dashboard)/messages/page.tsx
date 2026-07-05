"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/api";
import Card from "@/components/ui/Card";

export default function MessagesPage() {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Messages</h1>
        <p className="text-neutral-500">Chat with tutors and guardians.</p>
      </div>
      <Card className="text-center py-16">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-neutral-700">Coming in Phase 5</h2>
        <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto">
          Real-time messaging with SignalR will let you chat directly with matched tutors.
        </p>
      </Card>
    </div>
  );
}
