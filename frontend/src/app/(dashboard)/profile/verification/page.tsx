"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, otpApi, verificationApi, documentApi } from "@/lib/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import OtpInput from "@/components/sections/OtpInput";
import VerificationStatus from "@/components/sections/VerificationStatus";

export default function VerificationPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [docCount, setDocCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const checkState = useCallback(async () => {
    try {
      const docs = await documentApi.list();
      setDocCount(docs.length);
      const verified = docs.some(d => d.status === "Approved");
      if (verified) setStep(4);
      else if (docs.some(d => d.status === "Rejected") && docs.some(d => d.status === "Pending")) setStep(2);
      else if (docs.length > 0) setStep(2);
      else setStep(0);
    } catch { /* ignored */ }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return; }
    checkState();
  }, [router, checkState]);

  async function handleRequestOtp() {
    if (!phone.match(/^\+8801[3-9]\d{8}$/)) {
      setMessage("Enter a valid BD number: +8801XXXXXXXXX");
      return;
    }
    setMessage("");
    try {
      await otpApi.request({ phone });
      setOtpSent(true);
      setMessage("OTP sent (check console in dev).");
    } catch { setMessage("Failed to send OTP."); }
  }

  async function handleVerify(code: string) {
    setVerifying(true);
    try {
      const result = await otpApi.verify({ code });
      if (result.success) {
        setStep(1);
        setMessage("Phone verified!");
      } else {
        setMessage(result.message);
        setOtpSent(false);
      }
    } catch { setMessage("Verification failed."); }
    setVerifying(false);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await verificationApi.submit();
      setStep(3);
      setMessage("Profile submitted for review.");
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : "Submission failed.");
    }
    setSubmitting(false);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Verification</h1>
        <p className="text-neutral-500">Verify your identity to unlock full platform access.</p>
      </div>

      <Card className="mb-6">
        <VerificationStatus currentStep={step} />
      </Card>

      {message && <div className="mb-4 rounded-lg bg-primary-light px-4 py-3 text-sm text-primary">{message}</div>}

      <div className="space-y-6">
        <Card>
          <h3 className="font-semibold mb-3">Step 1: Verify Phone</h3>
          {!otpSent ? (
            <div className="flex gap-3">
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+8801XXXXXXXXX" className="flex-1" />
              <Button onClick={handleRequestOtp}>Send OTP</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-neutral-500">Enter the 6-digit code sent to {phone}</p>
              <OtpInput onComplete={handleVerify} disabled={verifying} />
              <button type="button" onClick={() => setOtpSent(false)} className="text-sm text-primary hover:underline">Change number</button>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">Step 2: Upload Documents</h3>
          <p className="text-sm text-neutral-500 mb-3">{docCount} document{docCount !== 1 ? "s" : ""} uploaded.</p>
          <Button variant="outline" onClick={() => router.push("/profile/documents")}>Go to Documents</Button>
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">Step 3: Submit for Review</h3>
          <p className="text-sm text-neutral-500 mb-3">Submit your profile for admin verification.</p>
          <Button onClick={handleSubmit} loading={submitting} disabled={step < 1 || docCount === 0}>
            Submit for Verification
          </Button>
        </Card>
      </div>
    </div>
  );
}
