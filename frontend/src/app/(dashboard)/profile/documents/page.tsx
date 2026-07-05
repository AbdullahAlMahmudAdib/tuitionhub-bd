"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, documentApi, DocumentDto } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const types = [{v:"Nid",l:"NID Card"},{v:"Certificate",l:"Certificate"},{v:"Result",l:"Result Sheet"},{v:"Other",l:"Other"}];

export default function DocumentsPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<DocumentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [docType, setDocType] = useState("Nid");
  const [message, setMessage] = useState("");

  const fetchDocs = useCallback(async () => {try{setDocs(await documentApi.list())}catch{}setLoading(false);},[]);
  useEffect(() => { if(!isAuthenticated()){router.push("/login");return}; fetchDocs(); },[router,fetchDocs]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if(!file)return;
    if(file.size > 5*1024*1024){setMessage("File too large. Max 5 MB.");return}
    try{await documentApi.upload(file, docType); setMessage("Uploaded successfully."); fetchDocs();}
    catch{setMessage("Upload failed.");}
  }

  const statusV = (s:string) => s==="Approved"?"default":s==="Rejected"?"destructive":"secondary";

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">Documents</h1><p className="text-muted-foreground">Upload verification documents for your profile.</p></div>
      <Card className="mb-6"><CardHeader><CardTitle>Upload Document</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">{types.map(t=><button key={t.v} onClick={()=>setDocType(t.v)} className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${docType===t.v?"bg-primary text-primary-foreground border-primary":"bg-background text-muted-foreground border-input"}`}>{t.l}</button>)}</div>
        <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-input p-8 cursor-pointer hover:border-primary/50 transition-colors text-center">
          <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={handleUpload} />
          <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p><p className="text-xs text-muted-foreground mt-1">JPG, PNG, or PDF up to 5 MB</p>
        </label>
        {message && <p className="text-sm text-primary">{message}</p>}
      </CardContent></Card>
      <h2 className="text-lg font-semibold mb-4">Your Documents</h2>
      {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : docs.length===0 ? <p className="text-sm text-muted-foreground">No documents yet.</p> :
        <div className="space-y-3">{docs.map(d=><Card key={d.id}><CardContent className="flex items-center justify-between pt-6"><div><p className="text-sm font-medium">{d.fileName}</p><p className="text-xs text-muted-foreground">{d.type} · {new Date(d.submittedAt).toLocaleDateString()}</p></div><Badge variant={statusV(d.status) as any}>{d.status}</Badge></CardContent></Card>)}</div>
      }
    </div>
  );
}
