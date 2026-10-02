import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import AboutHero from "@/components/about/AboutHero";
import AboutPrinciples from "@/components/about/AboutHero";

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      <AboutHero />

      <section className="border-b border-slate-200 py-20 lg:py-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
          <div className="lg:col-span-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              01 — Our story
            </span>
          </div>

          <div className="lg:col-span-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Less formatting. More focus.
            </h2>

            <p className="mt-5 text-base leading-relaxed text-slate-600">
              The product brings together professional templates, structured
              sections, and a live document preview so you can spend less time
              fighting a page and more time improving the story on it.
            </p>

            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Whether you are writing your first resume or updating years of
              experience, the same content can move between different visual
              styles without starting over.
            </p>
          </div>
        </div>
      </section>

      <AboutPrinciples />

      <section className="relative overflow-hidden border-t border-slate-200 bg-slate-950 py-16 text-white lg:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-1/3 top-0 h-72 w-[520px] rounded-full bg-indigo-600/30 blur-[120px]" />
          <div className="absolute right-1/3 bottom-0 h-72 w-[520px] rounded-full bg-fuchsia-600/30 blur-[120px]" />
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Ready to build?
            </span>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Start with a design you love.
            </h2>
          </div>

          <Link
            href="/resume-templates"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-xl transition-all hover:scale-[1.02] hover:bg-slate-100"
          >
            Explore Templates <IconArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
