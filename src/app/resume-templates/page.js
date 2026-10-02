"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IconArrowRight,
  IconCheck,
  IconSearch,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import TemplatePreview from "@/components/TemplatePreview";
import { TEMPLATE_DEFINITIONS } from "@/lib/resume-data";

export default function ResumeTemplates() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(TEMPLATE_DEFINITIONS.map((t) => t.category)),
  ];

  const templates = useMemo(
    () =>
      TEMPLATE_DEFINITIONS.filter(
        (t) =>
          (category === "All" || t.category === category) &&
          `${t.name} ${t.description} ${t.bestFor}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, category],
  );

  return (
    <main className="min-h-screen bg-slate-50/40">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-indigo-50/50 via-white to-white pt-16 pb-14 lg:pt-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-indigo-200/30 blur-[120px]" />

          <div className="absolute inset-0 bg-grid mask-fade" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 backdrop-blur">
              <IconSparkles size={14} />
              Resume Templates
            </span>

            {/* Heading */}
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Choose a design that makes your experience{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                unforgettable
              </span>
              .
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              Start with a polished layout, then make it yours. Every template
              uses the same structured content so you can switch designs without
              rebuilding your resume.
            </p>

            {/* Features */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <IconCheck size={16} className="text-emerald-600" />
                10 original layouts
              </span>

              <span className="flex items-center gap-1.5">
                <IconCheck size={16} className="text-emerald-600" />
                Desktop & mobile ready
              </span>

              <span className="flex items-center gap-1.5">
                <IconCheck size={16} className="text-emerald-600" />
                ATS-conscious typography
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-md">
            <IconSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by style, role or use case"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100"
              >
                <IconX size={16} />
              </button>
            )}
          </div>

          <span className="text-sm font-medium text-slate-500">
            {templates.length} of {TEMPLATE_DEFINITIONS.length} templates
          </span>
        </div>

        {/* Category Filters */}
        <div className="mt-6 flex gap-2 overflow-x-auto scroll-slim pb-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                category === c
                  ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: Math.min(i, 6) * 0.05,
              }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Preview */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200/60">
                <div className="absolute inset-0 origin-top scale-[0.9] p-3 transition-transform duration-500 group-hover:scale-95">
                  <TemplatePreview templateId={t.id} />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-slate-950/70 via-slate-900/0 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link
                    href={`/build-resume?template=${t.id}`}
                    className="inline-flex translate-y-2 items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 shadow-lg transition-transform group-hover:translate-y-0"
                  >
                    Use this template
                    <IconArrowRight size={14} />
                  </Link>
                </div>

                {/* Badge */}
                {i < 3 && (
                  <span className="absolute left-3 top-3 rounded-full border border-white bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 shadow">
                    {i === 0 ? "Popular" : "Featured"}
                  </span>
                )}
              </div>

              {/* Template Information */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {t.category}
                  </span>

                  <span className="text-[10px] font-medium text-slate-500">
                    {t.bestFor}
                  </span>
                </div>

                <h2 className="mt-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                  {t.name}
                </h2>

                <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-relaxed text-slate-600">
                  {t.description}
                </p>

                <Link
                  href={`/build-resume?template=${t.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Customize template
                  <IconArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Empty State */}
        {!templates.length && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No matching templates
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Try a different keyword or reset the filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Show all templates
            </button>
          </div>
        )}
      </section>
    </main>
  );
}