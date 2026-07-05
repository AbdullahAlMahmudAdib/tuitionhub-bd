"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { isAuthenticated, clearTokens } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, FileText, Shield, Search, Bell } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  useEffect(() => { if (!isAuthenticated()) router.push("/login"); }, [router]);

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Manage your account and preferences.</p></div>
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>Account Information</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Full Name</Label><Input defaultValue="Demo User" /></div><div className="space-y-2"><Label>Email</Label><Input defaultValue="demo@test.com" disabled /></div><div className="space-y-2"><Label>Phone</Label><Input defaultValue="+8801712345678" /></div></CardContent></Card>
        <Card><CardHeader><CardTitle>Quick Links</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">
          {[{href:"/profile",icon:User,title:"Profile",desc:"Edit bio and details"},{href:"/profile/documents",icon:FileText,title:"Documents",desc:"Upload verification docs"},{href:"/profile/verification",icon:Shield,title:"Verification",desc:"Verify your identity"},{href:"/tutors",icon:Search,title:"Find Tutors",desc:"Browse verified tutors"}].map(({href,icon:Icon,title,desc})=><Link key={href} href={href} className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"><div className="rounded-lg bg-primary/10 p-2"><Icon className="h-5 w-5 text-primary"/></div><div><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground">{desc}</p></div></Link>)}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Notifications</CardTitle></CardHeader><CardContent className="space-y-4">
          {[{label:"Email Notifications",desc:"Receive updates about applications",val:notifEmail,set:setNotifEmail},{label:"SMS Notifications",desc:"Get OTP alerts via SMS",val:notifSMS,set:setNotifSMS}].map(({label,desc,val,set})=><div key={label} className="flex items-center justify-between"><div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div><Switch checked={val} onCheckedChange={set} /></div>)}
        </CardContent></Card>
        <Card className="border-destructive/20"><CardHeader><CardTitle className="text-destructive">Danger Zone</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all data.</p>{!showDelete?<Button variant="destructive" onClick={()=>setShowDelete(true)}>Delete Account</Button>:<div className="flex gap-3"><Button variant="destructive" onClick={()=>{clearTokens();router.push("/")}}>Confirm Delete</Button><Button variant="outline" onClick={()=>setShowDelete(false)}>Cancel</Button></div>}</CardContent></Card>
      </div>
    </div>
  );
}
