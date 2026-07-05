"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { profileApi, ProfileResult, TutorProfileUpdate, GuardianProfileUpdate, SubjectInput, QualificationInput } from "@/lib/api";
import TutorSubjectEditor from "./TutorSubjectEditor";
import QualificationList from "./QualificationList";

export default function ProfileForm() {
  const [profile, setProfile] = useState<ProfileResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [preferredAreas, setPreferredAreas] = useState("");
  const [maxTravelKm, setMaxTravelKm] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>(["Saturday"]);
  const [subjects, setSubjects] = useState<SubjectInput[]>([]);
  const [qualifications, setQualifications] = useState<QualificationInput[]>([]);
  const [location, setLocation] = useState("");
  const [preferredSubjects, setPreferredSubjects] = useState("");
  const [childrenCount, setChildrenCount] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    profileApi.get()
      .then((p) => {
        setProfile(p);
        setBio(p.bio ?? "");
        if (p.role === "Tutor") {
          setHourlyRate(p.hourlyRate?.toString() ?? "");
          setExperienceYears(p.experienceYears?.toString() ?? "");
          setPreferredAreas(p.preferredAreas?.join(", ") ?? "");
          setMaxTravelKm(p.maxTravelKm?.toString() ?? "");
          setAvailableDays(p.availableDays ?? ["Saturday"]);
          setSubjects(p.subjects ?? []);
          setQualifications(p.qualifications ?? []);
        } else {
          setLocation(p.location ?? "");
          setPreferredSubjects(p.preferredSubjects?.join(", ") ?? "");
          setChildrenCount(p.childrenCount?.toString() ?? "");
          setBudgetMin(p.budgetMin?.toString() ?? "");
          setBudgetMax(p.budgetMax?.toString() ?? "");
        }
      })
      .catch(() => setMessage("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      if (profile?.role === "Tutor") {
        const data: TutorProfileUpdate = {
          bio, hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
          experienceYears: experienceYears ? parseInt(experienceYears) : undefined,
          preferredAreas: preferredAreas ? preferredAreas.split(",").map(s => s.trim()) : undefined,
          maxTravelKm: maxTravelKm ? parseInt(maxTravelKm) : undefined,
          availableDays, subjects, qualifications,
        };
        await profileApi.updateTutor(data);
      } else {
        const data: GuardianProfileUpdate = {
          bio, location,
          preferredSubjects: preferredSubjects ? preferredSubjects.split(",").map(s => s.trim()) : undefined,
          childrenCount: childrenCount ? parseInt(childrenCount) : undefined,
          budgetMin: budgetMin ? parseFloat(budgetMin) : undefined,
          budgetMax: budgetMax ? parseFloat(budgetMax) : undefined,
        };
        await profileApi.updateGuardian(data);
      }
      setMessage("Profile saved.");
    } catch {
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-center py-12 text-neutral-500">Loading...</div>;
  if (!profile) return <div className="text-center py-12 text-neutral-500">Could not load profile.</div>;

  const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  function toggleDay(day: string) {
    setAvailableDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }

  return (
    <div className="space-y-8">
      {message && <div className="rounded-lg bg-primary-light px-4 py-3 text-sm text-primary">{message}</div>}

      <Card>
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="text-sm font-medium text-neutral-700">Full Name</label><p className="text-sm text-neutral-500">{profile.fullName}</p></div>
          <div><label className="text-sm font-medium text-neutral-700">Email</label><p className="text-sm text-neutral-500">{profile.email}</p></div>
          <div><label className="text-sm font-medium text-neutral-700">Phone</label><p className="text-sm text-neutral-500">{profile.phone ?? "Not set"}</p></div>
          <div><label className="text-sm font-medium text-neutral-700">Role</label><p className="text-sm text-neutral-500 capitalize">{profile.role}</p></div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Profile Details</h2>
        <div className="space-y-4">
          <Input label="Bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." />

          {profile.role === "Tutor" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Hourly Rate (BDT)" type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} />
                <Input label="Experience (years)" type="number" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} />
              </div>
              <Input label="Preferred Areas" value={preferredAreas} onChange={e => setPreferredAreas(e.target.value)} placeholder="Gulshan, Banani, Uttara" helper="Comma-separated" />
              <Input label="Max Travel Distance (km)" type="number" value={maxTravelKm} onChange={e => setMaxTravelKm(e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {days.map(day => (
                    <button key={day} type="button" onClick={() => toggleDay(day)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        availableDays.includes(day) ? "bg-primary text-white border-primary" : "bg-white text-neutral-500 border-neutral-200 hover:border-primary"
                      }`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <TutorSubjectEditor subjects={subjects} onChange={setSubjects} />
              <QualificationList qualifications={qualifications} onChange={setQualifications} />
            </>
          ) : (
            <>
              <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Gulshan, Dhaka" />
              <Input label="Preferred Subjects" value={preferredSubjects} onChange={e => setPreferredSubjects(e.target.value)} placeholder="Math, Physics, English" helper="Comma-separated" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Children Count" type="number" value={childrenCount} onChange={e => setChildrenCount(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Budget Min (BDT)" type="number" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} />
                <Input label="Budget Max (BDT)" type="number" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} />
              </div>
            </>
          )}
        </div>
        <div className="mt-6">
          <Button onClick={handleSave} loading={saving}>Save Profile</Button>
        </div>
      </Card>
    </div>
  );
}
