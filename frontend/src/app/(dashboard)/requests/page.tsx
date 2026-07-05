"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TRequest { id:string;subject:string;studentClass:string;location:string;budget:string;daysPerWeek:number;status:"open"|"in-progress"|"filled";postedDate:string;applications:number }
const mockR: TRequest[] = [
  {id:"1",subject:"Mathematics",studentClass:"Class 8",location:"Gulshan",budget:"BDT 5,000–8,000",daysPerWeek:3,status:"open",postedDate:"2026-06-28",applications:5},
  {id:"2",subject:"English",studentClass:"Class 5",location:"Banani",budget:"BDT 4,000–6,000",daysPerWeek:2,status:"open",postedDate:"2026-07-01",applications:3},
  {id:"3",subject:"Physics",studentClass:"HSC 1st Year",location:"Dhanmondi",budget:"BDT 8,000–12,000",daysPerWeek:4,status:"in-progress",postedDate:"2026-06-20",applications:8},
  {id:"4",subject:"ICT",studentClass:"Class 10",location:"Uttara",budget:"BDT 6,000–9,000",daysPerWeek:3,status:"open",postedDate:"2026-07-03",applications:2},
  {id:"5",subject:"Chemistry + Biology",studentClass:"SSC Candidate",location:"Mirpur",budget:"BDT 10,000–15,000",daysPerWeek:5,status:"open",postedDate:"2026-07-02",applications:6},
  {id:"6",subject:"Bangla",studentClass:"Class 3",location:"Bashundhara",budget:"BDT 3,000–5,000",daysPerWeek:2,status:"filled",postedDate:"2026-06-15",applications:12},
];
const tabs=["All","Open","In Progress","Filled"] as const;
const sv=(s:string):"default"|"secondary"|"destructive"|"outline"=>{if(s==="open")return"default";if(s==="in-progress")return"secondary";return"outline"};

export default function RequestsPage() {
  const router = useRouter();
  const [tab,setTab]=useState<string>("All");
  const [open,setOpen]=useState(false);
  useEffect(()=>{if(!isAuthenticated())router.push("/login");},[router]);
  const filtered=mockR.filter(r=>{if(tab==="All")return true;if(tab==="Open")return r.status==="open";if(tab==="In Progress")return r.status==="in-progress";if(tab==="Filled")return r.status==="filled";return true});

  return (
    <div>
      <div className="mb-6 flex items-center justify-between"><div><h1 className="text-2xl font-bold">My Requests</h1><p className="text-muted-foreground">Manage tuition requests.</p></div>
        <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button>+ Post a Tuition</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Post a Tuition Request</DialogTitle></DialogHeader><div className="space-y-4 py-4"><div className="space-y-2"><Label>Subject</Label><Input placeholder="e.g. Mathematics"/></div><div className="space-y-2"><Label>Student Class</Label><Input placeholder="e.g. Class 8"/></div><div className="space-y-2"><Label>Location</Label><Input placeholder="e.g. Gulshan, Dhaka"/></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Budget Min</Label><Input type="number"/></div><div className="space-y-2"><Label>Budget Max</Label><Input type="number"/></div></div><div className="space-y-2"><Label>Days per Week</Label><Input type="number"/></div><Button className="w-full" onClick={()=>setOpen(false)}>Post Request</Button></div></DialogContent></Dialog>
      </div>
      <div className="mb-6 flex gap-1 rounded-lg bg-muted p-1 w-fit">{tabs.map(t=><button key={t} onClick={()=>setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${tab===t?"bg-background text-primary shadow-sm":"text-muted-foreground"}`}>{t}</button>)}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(r=><Card key={r.id} className="hover:border-primary/30 transition-colors"><CardContent className="pt-6"><div className="flex items-start justify-between mb-3"><h3 className="font-semibold">{r.subject}</h3><Badge variant={sv(r.status)}>{r.status==="in-progress"?"In Progress":r.status}</Badge></div><div className="space-y-1.5 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Class:</span>{r.studentClass}</div><div className="flex justify-between"><span className="text-muted-foreground">Location:</span>{r.location}</div><div className="flex justify-between"><span className="text-muted-foreground">Budget:</span><span className="font-medium text-primary">{r.budget}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Schedule:</span>{r.daysPerWeek} days/week</div></div><div className="mt-4 flex items-center justify-between border-t pt-3"><span className="text-xs text-muted-foreground">{r.postedDate} · {r.applications} apps</span><Button size="sm" variant="outline">Details</Button></div></CardContent></Card>)}
      </div>
    </div>
  );
}
