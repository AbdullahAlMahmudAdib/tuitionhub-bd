"use client";

interface Props {
  currentStep: number;
}

const steps = [
  "Phone Verified",
  "Documents Uploaded",
  "Submitted",
  "Under Review",
  "Verified",
];

export default function VerificationStatus({ currentStep }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 py-4">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2 flex-1">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 ${
            i < currentStep ? "bg-primary text-white" :
            i === currentStep ? "bg-primary-light text-primary border-2 border-primary" :
            "bg-neutral-100 text-neutral-400"
          }`}>
            {i < currentStep ? "✓" : i + 1}
          </div>
          <span className={`text-xs ${i <= currentStep ? "text-neutral-700 font-medium" : "text-neutral-400"}`}>
            {label}
          </span>
          {i < steps.length - 1 && (
            <div className={`hidden sm:block flex-1 h-0.5 mx-2 ${
              i < currentStep ? "bg-primary" : "bg-neutral-200"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}
