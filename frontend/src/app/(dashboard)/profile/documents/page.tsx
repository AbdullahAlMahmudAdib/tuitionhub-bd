"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, documentApi, DocumentDto } from "@/lib/api";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DocumentUpload from "@/components/sections/DocumentUpload";

export default function DocumentsPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<DocumentDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = useCallback(async () => {
    try { setDocs(await documentApi.list()); } catch { /* ignored */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return; }
    fetchDocs();
  }, [router, fetchDocs]);

  async function handleDelete(id: string) {
    await documentApi.delete(id);
    fetchDocs();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Documents</h1>
        <p className="text-neutral-500">Upload verification documents for your profile.</p>
      </div>

      <Card className="mb-8">
        <h3 className="font-semibold mb-3">Upload Document</h3>
        <DocumentUpload onUploaded={fetchDocs} />
      </Card>

      <h2 className="text-lg font-semibold mb-4">Your Documents</h2>
      {loading ? (
        <p className="text-sm text-neutral-500">Loading...</p>
      ) : docs.length === 0 ? (
        <p className="text-sm text-neutral-500">No documents uploaded yet.</p>
      ) : (
        <div className="space-y-3">
          {docs.map(doc => (
            <Card key={doc.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium">{doc.fileName}</p>
                  <p className="text-xs text-neutral-500">{doc.type} • {new Date(doc.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={doc.status === "Approved" ? "success" : doc.status === "Rejected" ? "warning" : "pending"}>
                  {doc.status}
                </Badge>
                {doc.status === "Pending" && (
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>Delete</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
