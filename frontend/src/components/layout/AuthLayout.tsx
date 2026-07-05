import { ReactNode } from "react";
import Logo from "@/components/shared/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-[#003320] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo size="lg" className="text-white [&>*:last-child]:text-white/60" />
        </div>
        <div className="rounded-xl bg-white p-6 shadow-lg sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
