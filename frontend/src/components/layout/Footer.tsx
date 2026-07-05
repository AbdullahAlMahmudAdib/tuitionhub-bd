import Link from "next/link";
import Logo from "@/components/shared/Logo";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <Logo size="lg" className="text-white" />
            <p className="mt-2 text-sm text-white/70 max-w-xs">
              Bangladesh&apos;s premier tuition marketplace connecting guardians with verified, qualified tutors.
            </p>
          </div>

          {/* For Tutors */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">For Tutors</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/register" className="text-sm text-white/60 hover:text-white transition-colors">Become a Tutor</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/faq" className="text-sm text-white/60 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* For Guardians */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">For Guardians</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/tutors" className="text-sm text-white/60 hover:text-white transition-colors">Find a Tutor</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/safety" className="text-sm text-white/60 hover:text-white transition-colors">Safety Tips</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-white/60">support@tuitionhub.com</li>
              <li className="text-sm text-white/60">Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} TuitionHub BD. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
