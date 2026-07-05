"use client";

import { motion } from "motion/react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";

const testimonials = [
  {
    name: "Fatima Rahman",
    role: "Guardian, Dhaka",
    quote: "Finding a qualified tutor for my daughter was so easy. The verification process gave me peace of mind.",
  },
  {
    name: "Rafiq Hasan",
    role: "Tutor, Uttara",
    quote: "I've found 3 tuition jobs in my first month. The platform connects me with families who actually need my subjects.",
  },
  {
    name: "Nusrat Jahan",
    role: "Guardian, Gulshan",
    quote: "The matching algorithm found a tutor perfectly suited for my son's needs. Highly recommend!",
  },
];

export default function TestimonialSection() {
  return (
    <section className="bg-ivory py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-neutral-900">What Our Users Say</h2>
        <p className="mt-2 text-center text-neutral-500 max-w-lg mx-auto">
          Real stories from real users across Bangladesh.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="border-l-4 border-l-primary h-full">
                <p className="text-sm text-neutral-600 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar name={t.name} size="md" />
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">{t.name}</div>
                    <div className="text-xs text-neutral-500">{t.role}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
