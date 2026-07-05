"use client";

import { motion } from "motion/react";

const steps = [
  { number: 1, title: "Create an Account", desc: "Sign up as a tutor or guardian in under 2 minutes." },
  { number: 2, title: "Find or Post", desc: "Browse verified tutors or post a tuition request." },
  { number: 3, title: "Connect & Verify", desc: "Chat, schedule interviews, and verify credentials." },
  { number: 4, title: "Start Learning", desc: "Begin tuition with secure payment protection." },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-neutral-900">How It Works</h2>
        <p className="mt-2 text-center text-neutral-500 max-w-lg mx-auto">
          Four simple steps to find your perfect match.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-primary/30" />
              )}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">{step.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
