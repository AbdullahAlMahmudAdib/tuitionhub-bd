"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { isAuthenticated, clearTokens } from "@/lib/api";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SettingsPage() {
  const router = useRouter();
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Account Info */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Account Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full Name" defaultValue="Demo User" />
            <Input label="Email" defaultValue="demo@test.com" disabled />
            <Input label="Phone" defaultValue="+8801712345678" />
          </div>
          <div className="mt-4">
            <Button size="sm">Save Changes</Button>
          </div>
        </Card>

        {/* Quick Links */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/profile" className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-primary-light/50">
              <div className="rounded-lg bg-primary-light p-2.5">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Profile Settings</p>
                <p className="text-xs text-neutral-500">Edit bio, subjects, qualifications</p>
              </div>
            </Link>
            <Link href="/profile/documents" className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-primary-light/50">
              <div className="rounded-lg bg-primary-light p-2.5">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Documents</p>
                <p className="text-xs text-neutral-500">Upload NID, certificates</p>
              </div>
            </Link>
            <Link href="/profile/verification" className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-primary-light/50">
              <div className="rounded-lg bg-primary-light p-2.5">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Verification</p>
                <p className="text-xs text-neutral-500">Verify phone, submit for review</p>
              </div>
            </Link>
            <Link href="/tutors" className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-primary-light/50">
              <div className="rounded-lg bg-primary-light p-2.5">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Find Tutors</p>
                <p className="text-xs text-neutral-500">Browse verified tutors</p>
              </div>
            </Link>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-neutral-900">Email Notifications</p>
                <p className="text-xs text-neutral-500">Receive updates about applications and messages</p>
              </div>
              <button
                onClick={() => setNotifEmail(!notifEmail)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifEmail ? "bg-primary" : "bg-neutral-200"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifEmail ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-neutral-900">SMS Notifications</p>
                <p className="text-xs text-neutral-500">Get OTP and verification alerts via SMS</p>
              </div>
              <button
                onClick={() => setNotifSMS(!notifSMS)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifSMS ? "bg-primary" : "bg-neutral-200"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifSMS ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-neutral-900">Marketing Emails</p>
                <p className="text-xs text-neutral-500">Tips, new features, and promotional offers</p>
              </div>
              <button
                onClick={() => setNotifMarketing(!notifMarketing)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifMarketing ? "bg-primary" : "bg-neutral-200"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifMarketing ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </label>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border border-cta/20">
          <h2 className="text-lg font-semibold text-cta mb-2">Danger Zone</h2>
          <p className="text-sm text-neutral-500 mb-4">Permanently delete your account and all data. This cannot be undone.</p>
          {!showDelete ? (
            <Button variant="cta" onClick={() => setShowDelete(true)}>Delete Account</Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="cta" onClick={() => { clearTokens(); router.push("/"); }}>Confirm Delete</Button>
              <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
