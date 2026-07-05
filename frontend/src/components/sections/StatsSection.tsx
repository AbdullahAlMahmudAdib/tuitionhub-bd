"use client";

import { motion } from "motion/react";

const stats = [
  { value: "500+", label: "Qualified Tutors" },
  { value: "1000+", label: "Students Matched" },
  { value: "50+", label: "Areas Covered" },
  { value: "98%", label: "Satisfaction Rate" },
];

export default function StatsSection() {
  return (
    <section className="bg-primary-light py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: i * 0.1 }}
                className="text-4xl font-extrabold text-primary sm:text-5xl"
              >
                {s.value}
              </motion.div>
              <div className="mt-1 text-sm text-neutral-600">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
