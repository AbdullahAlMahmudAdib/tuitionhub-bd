"use client";

import { SubjectInput } from "@/lib/api";
import Button from "@/components/ui/Button";

interface Props {
  subjects: SubjectInput[];
  onChange: (subjects: SubjectInput[]) => void;
}

const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function TutorSubjectEditor({ subjects, onChange }: Props) {
  function add() {
    onChange([...subjects, { name: "", proficiencyLevel: "Intermediate", hourlyRate: null }]);
  }

  function update(index: number, field: keyof SubjectInput, value: string | number | null) {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  function remove(index: number) {
    onChange(subjects.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">Subjects</label>
      {subjects.map((s, i) => (
        <div key={i} className="flex gap-2 mb-2 items-start">
          <input
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            placeholder="Subject name"
            value={s.name}
            onChange={e => update(i, "name", e.target.value)}
          />
          <select
            className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
            value={s.proficiencyLevel}
            onChange={e => update(i, "proficiencyLevel", e.target.value)}
          >
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <input
            className="w-24 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            type="number"
            placeholder="Rate/hr"
            value={s.hourlyRate ?? ""}
            onChange={e => update(i, "hourlyRate", e.target.value ? parseFloat(e.target.value) : null)}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-2 text-neutral-400 hover:text-cta transition-colors"
          >✕</button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add}>+ Add Subject</Button>
    </div>
  );
}
