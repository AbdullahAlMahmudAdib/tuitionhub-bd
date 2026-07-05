"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, verificationApi, PendingVerification } from "@/lib/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function AdminVerificationsPage() {
  const router = useRouter();
  const [pending, setPending] = useState<PendingVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const fetchPending = useCallback(async () => {
    try { setPending(await verificationApi.getPending()); } catch { /* ignored */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return; }
    fetchPending();
  }, [router, fetchPending]);

  async function handleApprove(userId: string) {
    await verificationApi.approve(userId);
    fetchPending();
  }

  async function handleReject() {
    if (!rejectId || !reason) return;
    await verificationApi.reject(rejectId, reason);
    setRejectId(null);
    setReason("");
    fetchPending();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Verification Queue</h1>
        <p className="text-neutral-500">Review and approve tutor/guardian profiles.</p>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading...</p>
      ) : pending.length === 0 ? (
        <Card><p className="text-sm text-neutral-500">No pending verifications.</p></Card>
      ) : (
        <div className="space-y-4">
          {pending.map(p => (
            <Card key={p.userId}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{p.fullName}</h3>
                  <p className="text-sm text-neutral-500 capitalize">{p.role} • {p.phone ?? "No phone"} • {p.documentCount} document{p.documentCount !== 1 ? "s" : ""}</p>
                  <p className="text-xs text-neutral-400">Submitted {new Date(p.submittedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleApprove(p.userId)}>Approve</Button>
                  <Button variant="outline" size="sm" onClick={() => setRejectId(p.userId)}>Reject</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-md">
            <h3 className="font-semibold mb-3">Rejection Reason</h3>
            <textarea
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm mb-4"
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Explain why this profile was rejected..."
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setRejectId(null)}>Cancel</Button>
              <Button variant="cta" onClick={handleReject} disabled={!reason}>Confirm Reject</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
