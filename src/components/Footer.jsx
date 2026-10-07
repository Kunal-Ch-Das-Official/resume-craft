import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconSparkles,
} from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="pointer-events-none absolute inset-0 -z-0 opacity-40">
        <div className="absolute -top-24 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
      </div>
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:gap-6 lg:px-8">
        <div className="lg:col-span-2">
          <Link className="inline-flex items-center gap-2.5" href="/">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg">
              <IconSparkles size={18} />
            </span>
            <span className="text-lg font-extrabold text-white">ResumeCraft</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Craft a premium, ATS-optimized resume in minutes. Beautiful templates, structured content, instant preview.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <a aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white" href="#"><IconBrandGithub size={16} /></a>
            <a aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white" href="#"><IconBrandLinkedin size={16} /></a>
            <a aria-label="X" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white" href="#"><IconBrandX size={16} /></a>
          </div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">Product</div>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li><Link className="hover:text-white" href="/resume-templates">Templates</Link></li>
            <li><Link className="hover:text-white" href="/resume-selector">Resume Builder</Link></li>
            <li><Link className="hover:text-white" href="/about">Features</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">Company</div>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li><Link className="hover:text-white" href="/about">About</Link></li>
            <li><Link className="hover:text-white" href="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <span>© 2026 ResumeCraft. Built for focused career storytelling.</span>
          <span>Crafted with care — Premium resumes, zero friction.</span>
        </div>
      </div>
    </footer>
  );
}
