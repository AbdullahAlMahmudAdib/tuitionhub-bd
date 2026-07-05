"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, otpApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const steps = ["Phone Verified","Documents Uploaded","Submitted","Under Review","Verified"];

export default function VerificationPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => { if(!isAuthenticated()) router.push("/login"); },[router]);

  async function handleRequestOtp() {
    if(!phone.match(/^\+8801[3-9]\d{8}$/)){setMessage("Enter a valid BD number.");return}
    try{await otpApi.request({phone});setOtpSent(true);setMessage("OTP sent (check console in dev).");}catch{setMessage("Failed.");}
  }
  async function handleVerify() {
    try{const r=await otpApi.verify({code});if(r.success){setStep(1);setMessage("Phone verified!");}else{setMessage(r.message);setOtpSent(false);}}catch{setMessage("Failed.");}
  }

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">Verification</h1><p className="text-muted-foreground">Verify your identity.</p></div>
      <Card className="mb-6"><CardContent className="pt-6"><div className="flex flex-wrap gap-2">{steps.map((l,i)=><div key={l} className="flex items-center gap-2"><div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i<step?"bg-primary text-primary-foreground":i===step?"bg-primary/10 text-primary border-2 border-primary":"bg-muted text-muted-foreground"}`}>{i<step?"✓":i+1}</div><span className={`text-xs ${i<=step?"font-medium":"text-muted-foreground"}`}>{l}</span>{i<4&&<div className={`hidden sm:block flex-1 h-0.5 w-4 ${i<step?"bg-primary":"bg-muted"}`}/>}</div>)}</div></CardContent></Card>
      {message && <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm">{message}</div>}
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>Step 1: Verify Phone</CardTitle></CardHeader><CardContent>
          {!otpSent ? (
            <div className="flex gap-3"><Input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+8801XXXXXXXXX" className="flex-1" /><Button onClick={handleRequestOtp}>Send OTP</Button></div>
          ) : (
            <div className="space-y-4"><p className="text-sm text-muted-foreground">Enter the 6-digit code sent to {phone}</p><Input value={code} onChange={e=>setCode(e.target.value)} placeholder="000000" maxLength={6} className="text-center text-xl w-32" /><div className="flex gap-2"><Button onClick={handleVerify}>Verify</Button><Button variant="ghost" onClick={()=>setOtpSent(false)}>Change number</Button></div></div>
          )}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Step 2: Upload Documents</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground mb-3">Upload at least one document (NID, certificate, etc.).</p><Button variant="outline" onClick={()=>router.push("/profile/documents")}>Go to Documents</Button></CardContent></Card>
        <Card><CardHeader><CardTitle>Step 3: Submit for Review</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground mb-3">Submit your profile for admin verification.</p><Button disabled={step<1}>Submit for Verification</Button></CardContent></Card>
      </div>
    </div>
  );
}
