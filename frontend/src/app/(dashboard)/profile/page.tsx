"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, profileApi, ProfileResult, GuardianProfileUpdate, SubjectInput, QualificationInput } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResult|null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [childrenCount, setChildrenCount] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => { if(!isAuthenticated()){router.push("/login");return} profileApi.get().then(p=>{setProfile(p);setBio(p.bio??"");setLocation(p.location??"");setChildrenCount(p.childrenCount?.toString()??"");setBudgetMin(p.budgetMin?.toString()??"");setBudgetMax(p.budgetMax?.toString()??"");}).finally(()=>setLoading(false)); },[router]);

  async function handleSave() {
    setSaving(true); setMessage("");
    try {
      await profileApi.updateGuardian({ bio, location, childrenCount: childrenCount?parseInt(childrenCount):undefined, budgetMin: budgetMin?parseFloat(budgetMin):undefined, budgetMax: budgetMax?parseFloat(budgetMax):undefined });
      setMessage("Profile saved.");
    } catch { setMessage("Failed to save."); }
    finally { setSaving(false); }
  }

  if(loading) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  if(!profile) return <div className="text-center py-12 text-muted-foreground">Could not load profile.</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Profile Settings</h1><p className="text-muted-foreground">Manage your profile details.</p></div>
      {message && <div className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}
      <Card><CardHeader><CardTitle>Basic Information</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><div><Label className="text-muted-foreground">Full Name</Label><p className="text-sm">{profile.fullName}</p></div><div><Label className="text-muted-foreground">Email</Label><p className="text-sm">{profile.email}</p></div><div><Label className="text-muted-foreground">Phone</Label><p className="text-sm">{profile.phone??"Not set"}</p></div><div><Label className="text-muted-foreground">Role</Label><Badge variant="secondary" className="capitalize">{profile.role}</Badge></div></CardContent></Card>
      <Card><CardHeader><CardTitle>Profile Details</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="space-y-2"><Label>Bio</Label><Input value={bio} onChange={e=>setBio(e.target.value)} placeholder="Tell us about yourself..." /></div>
        <div className="space-y-2"><Label>Location</Label><Input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Gulshan, Dhaka" /></div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2"><Label>Children Count</Label><Input type="number" value={childrenCount} onChange={e=>setChildrenCount(e.target.value)} /></div>
          <div className="space-y-2"><Label>Budget Min (BDT)</Label><Input type="number" value={budgetMin} onChange={e=>setBudgetMin(e.target.value)} /></div>
          <div className="space-y-2"><Label>Budget Max (BDT)</Label><Input type="number" value={budgetMax} onChange={e=>setBudgetMax(e.target.value)} /></div>
        </div>
        <Button onClick={handleSave} disabled={saving}>{saving?"Saving…":"Save Profile"}</Button>
      </CardContent></Card>
    </div>
  );
}
