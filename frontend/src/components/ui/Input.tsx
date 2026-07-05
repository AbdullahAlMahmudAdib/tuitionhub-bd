import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-500 shadow-sm transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary ${
              icon ? "pl-10" : ""
            } ${
              error
                ? "border-cta focus:ring-cta/40 focus:border-cta"
                : "border-neutral-200"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-cta">{error}</p>}
        {helper && !error && <p className="text-xs text-neutral-500">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
