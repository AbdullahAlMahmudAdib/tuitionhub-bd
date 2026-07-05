"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/api";
import ProfileForm from "@/components/sections/ProfileForm";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Profile Settings</h1>
        <p className="text-neutral-500">Manage your profile details and verification.</p>
      </div>
      <ProfileForm />
    </div>
  );
}
