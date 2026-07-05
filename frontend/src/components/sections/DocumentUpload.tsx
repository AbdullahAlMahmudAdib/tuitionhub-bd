"use client";

import { useState, useRef } from "react";
import { documentApi, DocumentDto } from "@/lib/api";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface Props {
  onUploaded?: () => void;
}

const docTypes = [
  { value: "Nid", label: "NID Card" },
  { value: "Certificate", label: "Certificate" },
  { value: "Result", label: "Result Sheet" },
  { value: "Other", label: "Other" },
];

export default function DocumentUpload({ onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState("Nid");
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage("File too large. Maximum 5 MB.");
      return;
    }

    setUploading(true);
    setMessage("");
    try {
      await documentApi.upload(file, docType);
      setMessage("Uploaded successfully.");
      if (onUploaded) onUploaded();
    } catch {
      setMessage("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Document Type</label>
        <div className="flex flex-wrap gap-2">
          {docTypes.map(dt => (
            <button
              key={dt.value}
              type="button"
              onClick={() => setDocType(dt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                docType === dt.value ? "bg-primary text-white border-primary" : "bg-white text-neutral-500 border-neutral-200"
              }`}
            >
              {dt.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f && fileRef.current) { const dt = new DataTransfer(); dt.items.add(f); fileRef.current.files = dt.files; fileRef.current.dispatchEvent(new Event("change", { bubbles: true })); }}}
      >
        <input ref={fileRef} type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFile} />
        {uploading ? (
          <p className="text-sm text-neutral-500">Uploading...</p>
        ) : (
          <>
            <svg className="mx-auto h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-neutral-500">Drag and drop or click to upload</p>
            <p className="text-xs text-neutral-400 mt-1">JPG, PNG, or PDF up to 5 MB</p>
          </>
        )}
      </div>

      {message && <p className="text-sm text-primary">{message}</p>}
    </div>
  );
}
