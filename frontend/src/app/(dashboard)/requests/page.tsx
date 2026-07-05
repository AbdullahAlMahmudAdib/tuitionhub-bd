"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/api";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

interface TuitionRequest {
  id: string;
  subject: string;
  studentClass: string;
  location: string;
  budget: string;
  daysPerWeek: number;
  status: "open" | "in-progress" | "filled";
  postedDate: string;
  applications: number;
}

const mockRequests: TuitionRequest[] = [
  { id: "1", subject: "Mathematics", studentClass: "Class 8", location: "Gulshan", budget: "BDT 5,000–8,000", daysPerWeek: 3, status: "open", postedDate: "2026-06-28", applications: 5 },
  { id: "2", subject: "English", studentClass: "Class 5", location: "Banani", budget: "BDT 4,000–6,000", daysPerWeek: 2, status: "open", postedDate: "2026-07-01", applications: 3 },
  { id: "3", subject: "Physics", studentClass: "HSC 1st Year", location: "Dhanmondi", budget: "BDT 8,000–12,000", daysPerWeek: 4, status: "in-progress", postedDate: "2026-06-20", applications: 8 },
  { id: "4", subject: "ICT", studentClass: "Class 10", location: "Uttara", budget: "BDT 6,000–9,000", daysPerWeek: 3, status: "open", postedDate: "2026-07-03", applications: 2 },
  { id: "5", subject: "Chemistry + Biology", studentClass: "SSC Candidate", location: "Mirpur", budget: "BDT 10,000–15,000", daysPerWeek: 5, status: "open", postedDate: "2026-07-02", applications: 6 },
  { id: "6", subject: "Bangla", studentClass: "Class 3", location: "Bashundhara", budget: "BDT 3,000–5,000", daysPerWeek: 2, status: "filled", postedDate: "2026-06-15", applications: 12 },
  { id: "7", subject: "Higher Math", studentClass: "HSC 2nd Year", location: "Mohammadpur", budget: "BDT 7,000–10,000", daysPerWeek: 4, status: "open", postedDate: "2026-06-30", applications: 4 },
];

const tabs = ["All", "Open", "In Progress", "Filled"] as const;

export default function RequestsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  const filtered = mockRequests.filter((r) => {
    if (activeTab === "All") return true;
    if (activeTab === "Open") return r.status === "open";
    if (activeTab === "In Progress") return r.status === "in-progress";
    if (activeTab === "Filled") return r.status === "filled";
    return true;
  });

  const statusVariant = (s: string) => {
    if (s === "open") return "success" as const;
    if (s === "in-progress") return "warning" as const;
    return "pending" as const;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Requests</h1>
          <p className="text-neutral-500">Manage tuition requests and applications.</p>
        </div>
        <Button onClick={() => setShowPostModal(true)}>+ Post a Tuition</Button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-neutral-100 p-1 w-fit">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${activeTab === t ? "bg-white text-primary shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>{t} {t === "All" ? `(${mockRequests.length})` : ""}</button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <Card key={r.id} variant="interactive">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-neutral-900">{r.subject}</h3>
              <Badge variant={statusVariant(r.status)}>{r.status === "in-progress" ? "In Progress" : r.status}</Badge>
            </div>
            <div className="space-y-1.5 text-sm text-neutral-600">
              <div className="flex justify-between"><span className="text-neutral-500">Class:</span> {r.studentClass}</div>
              <div className="flex justify-between"><span className="text-neutral-500">Location:</span> {r.location}</div>
              <div className="flex justify-between"><span className="text-neutral-500">Budget:</span> <span className="font-medium text-primary">{r.budget}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Schedule:</span> {r.daysPerWeek} days/week</div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
              <span className="text-xs text-neutral-400">{r.postedDate} · {r.applications} applications</span>
              <Button size="sm" variant="outline">View Details</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={showPostModal} onClose={() => setShowPostModal(false)} title="Post a Tuition Request">
        <div className="space-y-4">
          <Input label="Subject" placeholder="e.g. Mathematics" />
          <Input label="Student Class" placeholder="e.g. Class 8" />
          <Input label="Location" placeholder="e.g. Gulshan, Dhaka" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Budget Min (BDT)" type="number" />
            <Input label="Budget Max (BDT)" type="number" />
          </div>
          <Input label="Days per Week" type="number" />
          <Button className="w-full">Post Request</Button>
        </div>
      </Modal>
    </div>
  );
}
