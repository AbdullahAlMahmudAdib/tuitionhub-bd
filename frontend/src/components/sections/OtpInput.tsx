"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  length?: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
}

export default function OtpInput({ length = 6, onComplete, disabled }: Props) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newValues = [...values];
    newValues[index] = value.slice(-1);
    setValues(newValues);

    if (value && index < length - 1) refs.current[index + 1]?.focus();

    const code = newValues.join("");
    if (code.length === length) onComplete(code);
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const newValues = Array(length).fill("");
    for (let i = 0; i < paste.length; i++) newValues[i] = paste[i];
    setValues(newValues);
    const code = newValues.join("");
    if (code.length === length) onComplete(code);
    const next = Math.min(paste.length, length - 1);
    refs.current[next]?.focus();
  }

  return (
    <div className="flex gap-2 justify-center">
      {values.map((val, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          disabled={disabled}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-xl font-bold rounded-lg border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/40 outline-hidden disabled:opacity-50"
        />
      ))}
    </div>
  );
}
