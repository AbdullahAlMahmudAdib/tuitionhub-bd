"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/api";
import Card from "@/components/ui/Card";

export default function TutorsPage() {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Find Tutors</h1>
        <p className="text-neutral-500">Search and discover verified tutors near you.</p>
      </div>
      <Card className="text-center py-16">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-neutral-700">Coming in Phase 3</h2>
        <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto">
          The tutor directory with fuzzy search, filters, and detailed profiles will be available soon.
        </p>
      </Card>
    </div>
  );
}
