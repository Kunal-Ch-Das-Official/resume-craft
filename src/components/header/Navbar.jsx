"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconArrowRight,
  IconFileCv,
  IconInfoCircle,
  IconLayoutGrid,
  IconMenu2,
  IconMessage,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const LINKS = [
  {
    name: "Templates",
    href: "/resume-templates",
    icon: IconLayoutGrid,
  },
  {
    name: "Builder",
    href: "/build-resume",
    icon: IconFileCv,
  },
  {
    name: "About",
    href: "/about",
    icon: IconInfoCircle,
  },
  {
    name: "Contact",
    href: "/contact",
    icon: IconMessage,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
            <IconSparkles size={18} className="drop-shadow-sm" />

            <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-indigo-400 to-fuchsia-400 opacity-0 blur transition-opacity group-hover:opacity-50" />
          </span>

          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Resume
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Craft
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map(({ name, href, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-indigo-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon size={15} />
                {name}

                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 -z-10 rounded-lg bg-indigo-50 ring-1 ring-indigo-100"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/build-resume"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-slate-900/30 active:scale-[0.97]"
          >
            Create Resume
            <IconArrowRight size={15} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
          >
            {open ? <IconX size={19} /> : <IconMenu2 size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden mx-3 mb-3 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur-xl"
          >
            {LINKS.map(({ name, href, icon: Icon }) => {
              const active = pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={17} />
                  {name}
                </Link>
              );
            })}

            <Link
              href="/build-resume"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white"
            >
              Create your resume
              <IconArrowRight size={16} />
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
