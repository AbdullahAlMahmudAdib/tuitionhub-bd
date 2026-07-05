"use client";

import { QualificationInput } from "@/lib/api";
import Button from "@/components/ui/Button";

interface Props {
  qualifications: QualificationInput[];
  onChange: (quals: QualificationInput[]) => void;
}

export default function QualificationList({ qualifications, onChange }: Props) {
  function add() {
    onChange([...qualifications, { degree: "", institution: "", field: null, year: null }]);
  }

  function update(index: number, field: keyof QualificationInput, value: string | number | null) {
    const updated = [...qualifications];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  function remove(index: number) {
    onChange(qualifications.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">Qualifications</label>
      {qualifications.map((q, i) => (
        <div key={i} className="flex flex-wrap gap-2 mb-3 items-start">
          <input className="flex-1 min-w-[120px] rounded-lg border border-neutral-200 px-3 py-2 text-sm" placeholder="Degree" value={q.degree} onChange={e => update(i, "degree", e.target.value)} />
          <input className="flex-1 min-w-[120px] rounded-lg border border-neutral-200 px-3 py-2 text-sm" placeholder="Institution" value={q.institution} onChange={e => update(i, "institution", e.target.value)} />
          <input className="w-24 rounded-lg border border-neutral-200 px-3 py-2 text-sm" placeholder="Field" value={q.field ?? ""} onChange={e => update(i, "field", e.target.value || null)} />
          <input className="w-20 rounded-lg border border-neutral-200 px-3 py-2 text-sm" type="number" placeholder="Year" value={q.year ?? ""} onChange={e => update(i, "year", e.target.value ? parseInt(e.target.value) : null)} />
          <button type="button" onClick={() => remove(i)} className="p-2 text-neutral-400 hover:text-cta transition-colors">✕</button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add}>+ Add Qualification</Button>
    </div>
  );
}
