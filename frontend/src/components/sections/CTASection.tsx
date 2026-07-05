import Link from "next/link";
import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to Get Started?
        </h2>
        <p className="mt-3 text-lg text-white/70">
          Join thousands of tutors and guardians across Bangladesh already using TuitionHub BD.
        </p>
        <div className="mt-8">
          <Link href="/register">
            <Button variant="cta" size="lg">
              Join TuitionHub Today
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
