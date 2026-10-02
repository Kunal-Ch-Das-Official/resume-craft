"use client";

import { motion } from "framer-motion";
import { IconSparkles } from "@tabler/icons-react";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-indigo-50/50 to-white pt-16 pb-16 lg:pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-violet-200/30 blur-[120px]" />
        <div className="absolute inset-0 bg-grid mask-fade" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 backdrop-blur">
            <IconSparkles size={14} />
            About ResumeCraft
          </span>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            A better resume starts with a{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              better process
            </span>
            .
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
            ResumeCraft is designed around a simple idea: your resume should
            communicate your value clearly before it tries to impress anyone.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
