import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-xl font-bold text-primary-600">TuitionHub BD</span>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign in</Link>
          <Link href="/register" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-primary-700">Get started</Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Find Your Perfect <span className="text-primary-600">Tuition</span> in Bangladesh
        </h1>
        <p className="mt-4 max-w-lg text-lg text-gray-500">
          Connecting guardians with verified, qualified tutors across Dhaka and all divisions.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/register" className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-primary-700">Find a Tutor</Link>
          <Link href="/register" className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50">Become a Tutor</Link>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {[
            { title: "Verified Tutors", desc: "Background-checked, qualified educators near you" },
            { title: "Smart Matching", desc: "AI-powered tutor recommendations based on your needs" },
            { title: "Secure Payments", desc: "Safe, escrow-protected tuition fee transactions" },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border bg-white p-6 text-left shadow-xs">
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <footer className="border-t bg-white px-6 py-4 text-center text-sm text-gray-400">&copy; {new Date().getFullYear()} TuitionHub BD.</footer>
    </div>
  );
}
