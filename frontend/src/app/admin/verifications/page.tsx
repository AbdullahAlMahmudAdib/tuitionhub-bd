"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, verificationApi, PendingVerification } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function AdminVerificationsPage() {
  const router = useRouter();
  const [pending, setPending] = useState<PendingVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<string|null>(null);
  const [reason, setReason] = useState("");

  const fetch = useCallback(async () => { try { setPending(await verificationApi.getPending()); } catch {} setLoading(false); }, []);
  useEffect(() => { if (!isAuthenticated()) { router.push("/login"); return; } fetch(); }, [router, fetch]);

  async function approve(id: string) { await verificationApi.approve(id); fetch(); }
  async function reject() { if (!rejectId || !reason) return; await verificationApi.reject(rejectId, reason); setRejectId(null); setReason(""); fetch(); }

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">Verification Queue</h1><p className="text-muted-foreground">Review and approve profiles.</p></div>
      {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : pending.length === 0 ? <Card><CardContent className="py-8 text-center text-muted-foreground">No pending verifications.</CardContent></Card> :
        <div className="space-y-4">
          {pending.map(p => (
            <Card key={p.userId}><CardContent className="flex items-center justify-between pt-6">
              <div><h3 className="font-semibold">{p.fullName}</h3><p className="text-sm text-muted-foreground capitalize">{p.role} · {p.phone ?? "No phone"} · {p.documentCount} doc{p.documentCount !== 1 ? "s" : ""}</p><p className="text-xs text-muted-foreground">{new Date(p.submittedAt).toLocaleDateString()}</p></div>
              <div className="flex gap-2"><Button size="sm" onClick={() => approve(p.userId)}>Approve</Button><Button variant="outline" size="sm" onClick={() => setRejectId(p.userId)}>Reject</Button></div>
            </CardContent></Card>
          ))}
        </div>
      }
      <Dialog open={!!rejectId} onOpenChange={() => setRejectId(null)}>
        <DialogContent><DialogHeader><DialogTitle>Rejection Reason</DialogTitle></DialogHeader>
          <textarea className="w-full rounded-lg border border-input px-3 py-2 text-sm" rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="Explain why this profile was rejected..." />
          <div className="flex gap-2 justify-end"><Button variant="outline" onClick={() => setRejectId(null)}>Cancel</Button><Button variant="destructive" onClick={reject} disabled={!reason}>Confirm Reject</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
