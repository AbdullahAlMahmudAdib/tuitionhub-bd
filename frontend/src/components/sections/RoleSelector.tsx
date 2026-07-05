interface RoleSelectorProps {
  value: "tutor" | "guardian";
  onChange: (role: "tutor" | "guardian") => void;
}

export default function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="flex rounded-lg border border-neutral-200 p-1 bg-neutral-100">
      <button
        type="button"
        onClick={() => onChange("guardian")}
        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
          value === "guardian"
            ? "bg-white text-primary shadow-sm"
            : "text-neutral-500 hover:text-neutral-700"
        }`}
      >
        I&apos;m a Guardian
      </button>
      <button
        type="button"
        onClick={() => onChange("tutor")}
        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
          value === "tutor"
            ? "bg-white text-primary shadow-sm"
            : "text-neutral-500 hover:text-neutral-700"
        }`}
      >
        I&apos;m a Tutor
      </button>
    </div>
  );
}
