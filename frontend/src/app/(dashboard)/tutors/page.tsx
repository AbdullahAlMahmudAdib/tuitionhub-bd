"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/api";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  rate: number;
  experience: number;
  area: string;
  rating: number;
  bio: string;
  available: boolean;
}

const mockTutors: Tutor[] = [
  { id: "1", name: "Rafiq Hasan", subjects: ["Mathematics", "Physics"], rate: 800, experience: 5, area: "Uttara", rating: 4.8, bio: "BSc in Physics from DU. 5+ years of tutoring experience.", available: true },
  { id: "2", name: "Nusrat Jahan", subjects: ["English", "Bangla"], rate: 600, experience: 3, area: "Gulshan", rating: 4.9, bio: "MA in English Literature. Passionate about language teaching.", available: true },
  { id: "3", name: "Tanvir Ahmed", subjects: ["Chemistry", "Biology"], rate: 1000, experience: 7, area: "Dhanmondi", rating: 4.7, bio: "MBBS student. Expert in science subjects.", available: false },
  { id: "4", name: "Farzana Akhter", subjects: ["ICT", "Programming"], rate: 1200, experience: 4, area: "Banani", rating: 4.6, bio: "CSE graduate from BUET. Teaching programming and ICT.", available: true },
  { id: "5", name: "Rahim Uddin", subjects: ["Mathematics", "Accounting"], rate: 700, experience: 6, area: "Mirpur", rating: 4.5, bio: "BBA graduate. Specializing in math and accounting.", available: true },
  { id: "6", name: "Sabrina Islam", subjects: ["English", "IELTS"], rate: 1500, experience: 8, area: "Gulshan", rating: 5.0, bio: "IELTS trainer with 8+ years. British Council certified.", available: true },
  { id: "7", name: "Kamal Hossain", subjects: ["Physics", "Higher Math"], rate: 900, experience: 5, area: "Mohammadpur", rating: 4.4, bio: "DU Physics department. Specializing in HSC physics.", available: true },
  { id: "8", name: "Ayesha Siddiqua", subjects: ["Bangla", "General Science"], rate: 500, experience: 2, area: "Bashundhara", rating: 4.3, bio: "Honors student. Great with young learners.", available: false },
];

const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "English", "Bangla", "ICT", "Programming", "IELTS", "Accounting", "Higher Math", "General Science"];
const areas = ["All", "Gulshan", "Banani", "Uttara", "Dhanmondi", "Mirpur", "Mohammadpur", "Bashundhara"];

export default function TutorsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [area, setArea] = useState("All");
  const [maxRate, setMaxRate] = useState(2000);

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  const filtered = useMemo(() => {
    return mockTutors.filter((t) => {
      const matchesSearch = search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchesSubject = subject === "All" || t.subjects.includes(subject);
      const matchesArea = area === "All" || t.area === area;
      const matchesRate = t.rate <= maxRate;
      return matchesSearch && matchesSubject && matchesArea && matchesRate;
    });
  }, [search, subject, area, maxRate]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Find Tutors</h1>
        <p className="text-neutral-500">Search verified tutors across Dhaka.</p>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-neutral-500 self-center mr-1">Subject:</span>
            {subjects.map((s) => (
              <button key={s} onClick={() => setSubject(s)} className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${subject === s ? "bg-primary text-white border-primary" : "bg-white text-neutral-600 border-neutral-200 hover:border-primary"}`}>{s}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-neutral-500 self-center mr-1">Area:</span>
            {areas.map((a) => (
              <button key={a} onClick={() => setArea(a)} className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${area === a ? "bg-primary text-white border-primary" : "bg-white text-neutral-600 border-neutral-200 hover:border-primary"}`}>{a}</button>
            ))}
            <span className="text-xs font-medium text-neutral-500 ml-3">Max:</span>
            <span className="text-sm font-semibold text-primary">BDT {maxRate}</span>
            <input type="range" min={300} max={2000} step={100} value={maxRate} onChange={(e) => setMaxRate(Number(e.target.value))} className="w-24 accent-primary" />
          </div>
        </div>
      </Card>

      <p className="mb-4 text-sm text-neutral-500">{filtered.length} tutor{filtered.length !== 1 ? "s" : ""} found</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tutor) => (
          <Card key={tutor.id} variant="interactive" className="flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar name={tutor.name} size="lg" online={tutor.available} />
                <div>
                  <h3 className="font-semibold text-neutral-900">{tutor.name}</h3>
                  <p className="text-xs text-neutral-500">{tutor.area}</p>
                </div>
              </div>
              <Badge variant={tutor.available ? "success" : "pending"}>{tutor.available ? "Available" : "Busy"}</Badge>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {tutor.subjects.map((s) => (
                <span key={s} className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">{s}</span>
              ))}
            </div>
            <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{tutor.bio}</p>
            <div className="mt-auto flex items-center justify-between pt-3 border-t border-neutral-100">
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span>BDT {tutor.rate}/hr</span>
                <span>{tutor.experience}y exp</span>
                <span className="text-amber-500">★ {tutor.rating}</span>
              </div>
              <Button size="sm">View Profile</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
