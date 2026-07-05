"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Tutor { id:string;name:string;subjects:string[];rate:number;experience:number;area:string;rating:number;bio:string;available:boolean }
const mockTutors: Tutor[] = [
  {id:"1",name:"Rafiq Hasan",subjects:["Mathematics","Physics"],rate:800,experience:5,area:"Uttara",rating:4.8,bio:"BSc in Physics from DU. 5+ years of tutoring experience.",available:true},
  {id:"2",name:"Nusrat Jahan",subjects:["English","Bangla"],rate:600,experience:3,area:"Gulshan",rating:4.9,bio:"MA in English Literature. Passionate about language teaching.",available:true},
  {id:"3",name:"Tanvir Ahmed",subjects:["Chemistry","Biology"],rate:1000,experience:7,area:"Dhanmondi",rating:4.7,bio:"MBBS student. Expert in science subjects.",available:false},
  {id:"4",name:"Farzana Akhter",subjects:["ICT","Programming"],rate:1200,experience:4,area:"Banani",rating:4.6,bio:"CSE graduate from BUET. Teaching programming and ICT.",available:true},
  {id:"5",name:"Rahim Uddin",subjects:["Mathematics","Accounting"],rate:700,experience:6,area:"Mirpur",rating:4.5,bio:"BBA graduate. Specializing in math and accounting.",available:true},
  {id:"6",name:"Sabrina Islam",subjects:["English","IELTS"],rate:1500,experience:8,area:"Gulshan",rating:5.0,bio:"IELTS trainer with 8+ years. British Council certified.",available:true},
  {id:"7",name:"Kamal Hossain",subjects:["Physics","Higher Math"],rate:900,experience:5,area:"Mohammadpur",rating:4.4,bio:"DU Physics department. Specializing in HSC physics.",available:true},
  {id:"8",name:"Ayesha Siddiqua",subjects:["Bangla","General Science"],rate:500,experience:2,area:"Bashundhara",rating:4.3,bio:"Honors student. Great with young learners.",available:false},
];
const subjects=["All","Mathematics","Physics","Chemistry","Biology","English","Bangla","ICT","Programming","IELTS","Accounting","Higher Math","General Science"];
const areas=["All","Gulshan","Banani","Uttara","Dhanmondi","Mirpur","Mohammadpur","Bashundhara"];

export default function TutorsPage() {
  const router = useRouter();
  const [search,setSearch]=useState("");
  const [subject,setSubject]=useState("All");
  const [area,setArea]=useState("All");
  const [maxRate,setMaxRate]=useState(2000);
  useEffect(()=>{if(!isAuthenticated())router.push("/login");},[router]);
  const filtered=useMemo(()=>mockTutors.filter(t=>{
    const ms=search===""||t.name.toLowerCase().includes(search.toLowerCase())||t.subjects.some(s=>s.toLowerCase().includes(search.toLowerCase()));
    const msub=subject==="All"||t.subjects.includes(subject);
    const mar=area==="All"||t.area===area;
    return ms&&msub&&mar&&t.rate<=maxRate;
  }),[search,subject,area,maxRate]);

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">Find Tutors</h1><p className="text-muted-foreground">Search verified tutors across Dhaka.</p></div>
      <Card className="mb-6"><CardContent className="pt-6 space-y-4">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input placeholder="Search by name or subject..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9" /></div>
        <div className="flex flex-wrap gap-2"><span className="text-xs font-medium text-muted-foreground self-center">Subject:</span>{subjects.map(s=><button key={s} onClick={()=>setSubject(s)} className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${subject===s?"bg-primary text-primary-foreground border-primary":"bg-background text-muted-foreground border-input hover:border-primary"}`}>{s}</button>)}</div>
        <div className="flex flex-wrap gap-2 items-center"><span className="text-xs font-medium text-muted-foreground self-center">Area:</span>{areas.map(a=><button key={a} onClick={()=>setArea(a)} className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${area===a?"bg-primary text-primary-foreground border-primary":"bg-background text-muted-foreground border-input hover:border-primary"}`}>{a}</button>)}<span className="text-xs font-medium text-muted-foreground ml-3">Max: BDT {maxRate}</span><input type="range" min={300} max={2000} step={100} value={maxRate} onChange={e=>setMaxRate(Number(e.target.value))} className="w-24 accent-primary" /></div>
      </CardContent></Card>
      <p className="mb-4 text-sm text-muted-foreground">{filtered.length} tutor{filtered.length!==1?"s":""} found</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(t=><Card key={t.id} className="hover:border-primary/30 transition-colors"><CardContent className="pt-6"><div className="flex items-start justify-between mb-3"><div className="flex items-center gap-3"><Avatar><AvatarFallback>{t.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback></Avatar><div><h3 className="font-semibold">{t.name}</h3><p className="text-xs text-muted-foreground">{t.area}</p></div></div><Badge variant={t.available?"default":"secondary"}>{t.available?"Available":"Busy"}</Badge></div><div className="flex flex-wrap gap-1 mb-2">{t.subjects.map(s=><span key={s} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{s}</span>)}</div><p className="text-sm text-muted-foreground mb-3 line-clamp-2">{t.bio}</p><div className="flex items-center justify-between pt-3 border-t"><div className="flex items-center gap-4 text-xs text-muted-foreground"><span>BDT {t.rate}/hr</span><span>{t.experience}y exp</span><span className="text-amber-500">★ {t.rating}</span></div><Button size="sm">View</Button></div></CardContent></Card>)}
      </div>
    </div>
  );
}
