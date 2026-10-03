"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";

import {
  IconBriefcase,
  IconBrandGithub,
  IconBrandLinkedin,
  IconChevronDown,
  IconChevronUp,
  IconCode,
  IconDeviceFloppy,
  IconEye,
  IconFolderCode,
  IconLayoutGrid,
  IconMapPin,
  IconMinus,
  IconPhone,
  IconPlus,
  IconPrinter,
  IconRefresh,
  IconSchool,
  IconSparkles,
  IconTrash,
  IconUserCircle,
  IconWand,
  IconWorld,
  IconX,
} from "@tabler/icons-react";

import ResumeRenderer from "@/components/ResumeRenderer";

import {
  DEMO_RESUME,
  EMPTY_RESUME,
  TEMPLATE_DEFINITIONS,
  cloneResume,
} from "@/lib/resume-data";

const tabs = [
  ["Basics", IconUserCircle],

  ["Experience", IconBriefcase],

  ["Education", IconSchool],

  ["Skills", IconCode],

  ["Projects", IconFolderCode],

  ["More", IconLayoutGrid],
];

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const labelClass =
  "mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500";

const subtleButton =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50";

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <label className="block">
      <span className={labelClass}>
        {Icon ? <Icon size={13} /> : null}
        {label}
      </span>

      <input
        className={inputClass}
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function AreaField({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <textarea
        className={`${inputClass} resize-none`}
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Section({
  title,
  description,
  required = false,
  children,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 bg-white px-5 py-4 text-left transition-colors hover:bg-slate-50/60"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <strong className="text-sm font-semibold text-slate-900">
              {title}
            </strong>

            {required ? (
              <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                Required
              </span>
            ) : null}
          </div>

          <small className="mt-0.5 block text-xs text-slate-500">
            {description}
          </small>
        </div>

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {open ? <IconChevronUp size={15} /> : <IconChevronDown size={15} />}
        </span>
      </button>

      {open ? <div className="grid gap-4 px-5 pb-6">{children}</div> : null}
    </section>
  );
}

function ActionButton({ children, icon: Icon, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        primary
          ? "inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:shadow-indigo-500/50 active:scale-[0.97]"
          : subtleButton
      }
    >
      {Icon ? <Icon size={15} /> : null}

      <span className="hidden sm:inline">{children}</span>
    </button>
  );
}

function EmptyState({ label }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center text-xs text-slate-500">
      No {label} added yet.
    </div>
  );
}

export default function ResumeBuilder({
  initialTemplate = "clean-ats-optimizer",
}) {
  const validInitial = TEMPLATE_DEFINITIONS.some(
    (item) => item.id === initialTemplate,
  )
    ? initialTemplate
    : "clean-ats-optimizer";

  // Initialize with DEMO_RESUME so sample data is shown right away

  const [resume, setResume] = useState(() => ({
    ...cloneResume(DEMO_RESUME),
    templateName: validInitial,
  }));

  const [activeTab, setActiveTab] = useState("Basics");

  const [saved, setSaved] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);

  const [zoom, setZoom] = useState(60); // Default reduced resume preview size

  const [hydrated, setHydrated] = useState(false);

  // Robust split-pane resizing. The divider has a large invisible hit area
  // so the cursor changes reliably when the pointer reaches the middle.
  const [formWidth, setFormWidth] = useState(650);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const editorRef = useRef(null);

  const MIN_FORM_WIDTH = 350;
  const MIN_PREVIEW_WIDTH = 300;
  const DIVIDER_HIT_WIDTH = 20;

  const stopDragging = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;

    const editor = editorRef.current;
    if (!editor) return;

    const rect = editor.getBoundingClientRect();
    const maxFormWidth = Math.max(
      MIN_FORM_WIDTH,
      rect.width - DIVIDER_HIT_WIDTH - MIN_PREVIEW_WIDTH,
    );

    const nextWidth = Math.min(
      Math.max(e.clientX - rect.left, MIN_FORM_WIDTH),
      maxFormWidth,
    );

    setFormWidth(nextWidth);
  }, []);

  const startDragging = useCallback((e) => {
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    isDraggingRef.current = true;
    setIsDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDragging);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDragging);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [onMouseMove, stopDragging]);

  useEffect(() => {
    const handleResize = () => {
      const editor = editorRef.current;
      if (!editor) return;

      const rect = editor.getBoundingClientRect();
      const maxFormWidth = Math.max(
        MIN_FORM_WIDTH,
        rect.width - DIVIDER_HIT_WIDTH - MIN_PREVIEW_WIDTH,
      );

      setFormWidth((current) =>
        Math.min(Math.max(current, MIN_FORM_WIDTH), maxFormWidth),
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("resumecraft-draft");

      if (raw) {
        const parsed = JSON.parse(raw);

        setResume(
          validInitial !== "clean-ats-optimizer"
            ? { ...parsed, templateName: validInitial }
            : parsed,
        );
      }
    } catch {
      // Ignore malformed local drafts.
    } finally {
      setHydrated(true);
    }
  }, [validInitial]);

  const update = (path, value) => {
    setResume((current) => {
      const next = cloneResume(current);

      const keys = path.split(".");

      const last = keys.pop();

      let target = next;

      for (const key of keys) {
        target[key] ??= {};

        target = target[key];
      }

      target[last] = value;

      return next;
    });
  };

  const setMapItem = (root, collectionKey, id, field, value) => {
    setResume((current) => ({
      ...current,

      [root]: {
        ...current[root],

        [collectionKey]: {
          ...current[root][collectionKey],

          [id]: { ...current[root][collectionKey][id], [field]: value },
        },
      },
    }));
  };

  const addExperience = () => {
    setResume((current) => {
      const id = `company-${Date.now()}`;

      return {
        ...current,

        workExperience: {
          ...current.workExperience,

          companies: {
            ...current.workExperience.companies,

            [id]: {
              priority:
                Object.keys(current.workExperience.companies).length + 1,

              jobTitle: "",

              companyName: "",

              jobConditions: "REMOTE",

              jobTypes: "FULL_TIME",

              jobLocation: "",

              responsibility: [""],

              startDate: "",

              isPresentJob: true,
            },
          },
        },
      };
    });
  };

  const removeExperience = (id) =>
    setResume((current) => ({
      ...current,
      workExperience: {
        ...current.workExperience,
        companies: Object.fromEntries(
          Object.entries(current.workExperience.companies).filter(
            ([key]) => key !== id,
          ),
        ),
      },
    }));

  const addEducation = () => {
    setResume((current) => {
      const id = `education-${Date.now()}`;

      return {
        ...current,

        educations: {
          ...current.educations,

          qualifications: {
            ...current.educations.qualifications,

            [id]: {
              priority:
                Object.keys(current.educations.qualifications).length + 1,

              institutionName: "",
              startedAt: "",
              yearOfComplete: "",
              pursuing: false,
              percentage: "",
              description: "",
            },
          },
        },
      };
    });
  };

  const removeEducation = (id) =>
    setResume((current) => ({
      ...current,
      educations: {
        ...current.educations,
        qualifications: Object.fromEntries(
          Object.entries(current.educations.qualifications).filter(
            ([key]) => key !== id,
          ),
        ),
      },
    }));

  const addProject = () => {
    setResume((current) => {
      const id = `project-${Date.now()}`;

      return {
        ...current,

        projects: {
          ...current.projects,

          projects: {
            ...current.projects.projects,

            [id]: {
              priority: Object.keys(current.projects.projects).length + 1,
              name: "",
              description: "",
              projectUrl: "",
              startDate: "",
              isWorking: true,
              techStack: [],
              skills: [],
            },
          },
        },
      };
    });
  };

  const removeProject = (id) =>
    setResume((current) => ({
      ...current,
      projects: {
        ...current.projects,
        projects: Object.fromEntries(
          Object.entries(current.projects.projects).filter(
            ([key]) => key !== id,
          ),
        ),
      },
    }));

  const saveDraft = () => {
    window.localStorage.setItem("resumecraft-draft", JSON.stringify(resume));

    setSaved(true);

    window.setTimeout(() => setSaved(false), 2200);
  };

  const reset = () => {
    setResume({ ...cloneResume(EMPTY_RESUME), templateName: validInitial });

    window.localStorage.removeItem("resumecraft-draft");
  };

  const loadDemo = () =>
    setResume({ ...cloneResume(DEMO_RESUME), templateName: validInitial });

  const print = () => window.print();

  const experienceEntries = Object.entries(
    resume.workExperience?.companies || {},
  );

  const educationEntries = Object.entries(
    resume.educations?.qualifications || {},
  );

  const projectEntries = Object.entries(resume.projects?.projects || {});

  const skillGroups = Object.entries(resume.skills?.skills || {});

  const template = useMemo(
    () =>
      TEMPLATE_DEFINITIONS.find((item) => item.id === resume.templateName) ||
      TEMPLATE_DEFINITIONS[0],
    [resume.templateName],
  );

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100/60">
      <div className="no-print sticky top-16 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
              <IconSparkles size={13} />
              Resume Editor
            </div>

            <h1 className="mt-0.5 truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Build your resume
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ActionButton icon={IconWand} onClick={loadDemo}>
              Sample
            </ActionButton>

            <ActionButton icon={IconRefresh} onClick={reset}>
              Reset
            </ActionButton>

            <ActionButton icon={IconPrinter} onClick={print}>
              Print / PDF
            </ActionButton>

            <button
              type="button"
              className={`${subtleButton} lg:hidden`}
              onClick={() => setPreviewOpen(true)}
            >
              <IconEye size={15} />
              Preview
            </button>

            <ActionButton primary icon={IconDeviceFloppy} onClick={saveDraft}>
              {saved ? "Saved" : "Save Draft"}
            </ActionButton>
          </div>
        </div>
      </div>

      <div
        ref={editorRef}
        className="hidden lg:flex w-full min-w-0 overflow-hidden"
        style={{ height: "calc(100vh - 4rem - 65px)" }}
      >
        {/* Form Container */}

        <aside
          className="no-print border-r border-slate-200 bg-white shrink-0 overflow-hidden flex flex-col"
          style={{ width: `${formWidth}px` }}
        >
          <div className="sticky top-0 z-10 flex gap-1 overflow-x-auto border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur scroll-slim">
            {tabs.map(([name, Icon]) => (
              <button
                key={name}
                type="button"
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${activeTab === name ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                onClick={() => setActiveTab(name)}
              >
                <Icon size={14} />
                {name}
              </button>
            ))}
          </div>

          <div
            className="scroll-slim overflow-y-auto flex-1"
            style={{ maxHeight: "calc(100vh - 4rem - 65px - 56px)" }}
          >
            {activeTab === "Basics" && (
              <>
                <Section
                  title="Personal details"
                  required
                  description="The first impression at the top of your resume"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field
                      label="Full name"
                      value={resume.basicInfo.fullName}
                      onChange={(v) => update("basicInfo.fullName", v)}
                      placeholder="Alex Morgan"
                    />

                    <Field
                      label="Target role"
                      value={resume.basicInfo.position}
                      onChange={(v) => update("basicInfo.position", v)}
                      placeholder="Software Engineer"
                    />

                    <Field
                      label="Email"
                      type="email"
                      value={resume.contactInfo.primaryEmail}
                      onChange={(v) => update("contactInfo.primaryEmail", v)}
                      placeholder="alex@example.com"
                    />

                    <Field
                      label="Phone"
                      icon={IconPhone}
                      value={resume.contactInfo.primaryMobile}
                      onChange={(v) => update("contactInfo.primaryMobile", v)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </Section>

                <Section
                  title="Profile summary"
                  description="A concise 2–4 sentence introduction"
                >
                  <AreaField
                    label="Professional summary"
                    value={resume.profileSummary.objective}
                    onChange={(v) => update("profileSummary.objective", v)}
                    placeholder="Describe your experience, strengths and the value you bring…"
                  />
                </Section>

                <Section
                  title="Location & links"
                  description="Optional contact details"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field
                      label="City"
                      icon={IconMapPin}
                      value={resume.address.city}
                      onChange={(v) => update("address.city", v)}
                      placeholder="Kolkata"
                    />

                    <Field
                      label="Country"
                      value={resume.address.country}
                      onChange={(v) => update("address.country", v)}
                      placeholder="India"
                    />
                  </div>

                  <Field
                    label="LinkedIn"
                    icon={IconBrandLinkedin}
                    value={resume.contactInfo.linkedin}
                    onChange={(v) => update("contactInfo.linkedin", v)}
                    placeholder="linkedin.com/in/yourname"
                  />

                  <Field
                    label="GitHub"
                    icon={IconBrandGithub}
                    value={resume.contactInfo.github}
                    onChange={(v) => update("contactInfo.github", v)}
                    placeholder="github.com/yourname"
                  />

                  <Field
                    label="Portfolio"
                    icon={IconWorld}
                    value={resume.contactInfo.portfolio}
                    onChange={(v) => update("contactInfo.portfolio", v)}
                    placeholder="yourportfolio.com"
                  />
                </Section>
              </>
            )}

            {activeTab === "Experience" && (
              <Section
                title="Work experience"
                description="Add your most relevant roles"
              >
                <div className="grid gap-3">
                  {experienceEntries.length ? (
                    experienceEntries.map(([id, item], index) => (
                      <div
                        key={id}
                        className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <strong className="text-sm font-semibold text-slate-900">
                            Experience {index + 1}
                          </strong>
                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50"
                            onClick={() => removeExperience(id)}
                            aria-label="Remove experience"
                          >
                            <IconTrash size={15} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Field
                            label="Job title"
                            value={item.jobTitle}
                            onChange={(v) =>
                              setMapItem(
                                "workExperience",
                                "companies",
                                id,
                                "jobTitle",
                                v,
                              )
                            }
                            placeholder="Software Engineer"
                          />

                          <Field
                            label="Company"
                            value={item.companyName || ""}
                            onChange={(v) =>
                              setMapItem(
                                "workExperience",
                                "companies",
                                id,
                                "companyName",
                                v,
                              )
                            }
                            placeholder="Company name"
                          />

                          <Field
                            label="Start date"
                            value={item.startDate}
                            onChange={(v) =>
                              setMapItem(
                                "workExperience",
                                "companies",
                                id,
                                "startDate",
                                v,
                              )
                            }
                            placeholder="2024-01"
                          />

                          <Field
                            label="Location"
                            value={item.jobLocation}
                            onChange={(v) =>
                              setMapItem(
                                "workExperience",
                                "companies",
                                id,
                                "jobLocation",
                                v,
                              )
                            }
                            placeholder="Kolkata / Remote"
                          />
                        </div>

                        <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <input
                            type="checkbox"
                            checked={!!item.isPresentJob}
                            onChange={(e) =>
                              setMapItem(
                                "workExperience",
                                "companies",
                                id,
                                "isPresentJob",
                                e.target.checked,
                              )
                            }
                          />
                          I currently work here
                        </label>

                        <AreaField
                          label="Responsibilities"
                          value={(item.responsibility || []).join("\n")}
                          onChange={(v) =>
                            setMapItem(
                              "workExperience",
                              "companies",
                              id,
                              "responsibility",
                              v.split("\n"),
                            )
                          }
                          placeholder="One accomplishment per line…"
                        />
                      </div>
                    ))
                  ) : (
                    <EmptyState label="experience" />
                  )}
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/60 px-3 py-2.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                  onClick={addExperience}
                >
                  <IconPlus size={15} />
                  Add experience
                </button>
              </Section>
            )}

            {activeTab === "Education" && (
              <Section
                title="Education"
                description="Degrees, courses and qualifications"
              >
                <div className="grid gap-3">
                  {educationEntries.length ? (
                    educationEntries.map(([id, item], index) => (
                      <div
                        key={id}
                        className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <strong className="text-sm font-semibold text-slate-900">
                            Education {index + 1}
                          </strong>
                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50"
                            onClick={() => removeEducation(id)}
                            aria-label="Remove education"
                          >
                            <IconTrash size={15} />
                          </button>
                        </div>

                        <Field
                          label="Institution"
                          value={item.institutionName}
                          onChange={(v) =>
                            setMapItem(
                              "educations",
                              "qualifications",
                              id,
                              "institutionName",
                              v,
                            )
                          }
                          placeholder="University / College"
                        />

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Field
                            label="Start"
                            value={item.startedAt}
                            onChange={(v) =>
                              setMapItem(
                                "educations",
                                "qualifications",
                                id,
                                "startedAt",
                                v,
                              )
                            }
                            placeholder="2020"
                          />
                          <Field
                            label="Completion"
                            value={item.yearOfComplete}
                            onChange={(v) =>
                              setMapItem(
                                "educations",
                                "qualifications",
                                id,
                                "yearOfComplete",
                                v,
                              )
                            }
                            placeholder="2024"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Field
                            label="Degree / result"
                            value={item.description}
                            onChange={(v) =>
                              setMapItem(
                                "educations",
                                "qualifications",
                                id,
                                "description",
                                v,
                              )
                            }
                            placeholder="B.A. Economics"
                          />
                          <Field
                            label="Grade / percentage"
                            value={item.percentage}
                            onChange={(v) =>
                              setMapItem(
                                "educations",
                                "qualifications",
                                id,
                                "percentage",
                                v,
                              )
                            }
                            placeholder="8.2 CGPA"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState label="education" />
                  )}
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/60 px-3 py-2.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                  onClick={addEducation}
                >
                  <IconPlus size={15} />
                  Add education
                </button>
              </Section>
            )}

            {activeTab === "Skills" && (
              <Section title="Skills" description="Group skills by category">
                <div className="grid gap-3">
                  {skillGroups.length ? (
                    skillGroups.map(([group, skills]) => (
                      <div
                        key={group}
                        className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                      >
                        <Field
                          label="Category"
                          value={group}
                          onChange={(v) =>
                            setResume((r) => {
                              const next = { ...r.skills.skills };
                              delete next[group];
                              next[
                                v || `Category ${Object.keys(next).length + 1}`
                              ] = skills;
                              return {
                                ...r,
                                skills: { ...r.skills, skills: next },
                              };
                            })
                          }
                        />

                        <Field
                          label="Skills"
                          value={skills.join(", ")}
                          onChange={(v) =>
                            update(
                              `skills.skills.${group}`,
                              v
                                .split(",")
                                .map((x) => x.trim())
                                .filter(Boolean),
                            )
                          }
                          placeholder="React, Node.js, PostgreSQL"
                        />
                      </div>
                    ))
                  ) : (
                    <EmptyState label="skill groups" />
                  )}
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/60 px-3 py-2.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                  onClick={() =>
                    setResume((r) => ({
                      ...r,
                      skills: {
                        ...r.skills,
                        skills: {
                          ...r.skills.skills,
                          [`Category ${Object.keys(r.skills.skills).length + 1}`]:
                            [],
                        },
                      },
                    }))
                  }
                >
                  <IconPlus size={15} />
                  Add skill category
                </button>
              </Section>
            )}

            {activeTab === "Projects" && (
              <Section
                title="Projects"
                description="Show practical work and measurable outcomes"
              >
                <div className="grid gap-3">
                  {projectEntries.length ? (
                    projectEntries.map(([id, item], index) => (
                      <div
                        key={id}
                        className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <strong className="text-sm font-semibold text-slate-900">
                            Project {index + 1}
                          </strong>
                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50"
                            onClick={() => removeProject(id)}
                            aria-label="Remove project"
                          >
                            <IconTrash size={15} />
                          </button>
                        </div>

                        <Field
                          label="Project name"
                          value={item.name || ""}
                          onChange={(v) =>
                            setMapItem("projects", "projects", id, "name", v)
                          }
                          placeholder="Project name"
                        />

                        <AreaField
                          label="Description"
                          value={item.description}
                          onChange={(v) =>
                            setMapItem(
                              "projects",
                              "projects",
                              id,
                              "description",
                              v,
                            )
                          }
                          placeholder="What did you build and what changed because of it?"
                        />

                        <Field
                          label="Project URL"
                          value={item.projectUrl}
                          onChange={(v) =>
                            setMapItem(
                              "projects",
                              "projects",
                              id,
                              "projectUrl",
                              v,
                            )
                          }
                          placeholder="github.com/…"
                        />
                      </div>
                    ))
                  ) : (
                    <EmptyState label="projects" />
                  )}
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/60 px-3 py-2.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                  onClick={addProject}
                >
                  <IconPlus size={15} />
                  Add project
                </button>
              </Section>
            )}

            {activeTab === "More" && (
              <>
                <Section title="Languages" description="Language proficiency">
                  <Field
                    label="Languages"
                    value={(resume.languageProficiency.languageKnows || [])
                      .map(
                        (x) =>
                          `${x.languageName} (${x.proficiencyOutOfTen}/10)`,
                      )
                      .join(", ")}
                    onChange={(v) =>
                      update(
                        "languageProficiency.languageKnows",
                        v
                          .split(",")
                          .map((entry) => {
                            const m = entry
                              .trim()
                              .match(/^(.+?)\s*\((\d+)\s*\/\s*10\)$/);
                            return {
                              languageName: m?.[1]?.trim() || entry.trim(),
                              proficiencyOutOfTen: Number(m?.[2] || 8),
                            };
                          })
                          .filter((x) => x.languageName),
                      )
                    }
                    placeholder="English (9/10), Hindi (8/10)"
                  />
                </Section>

                <Section
                  title="Template"
                  description="Switch the visual design at any time"
                >
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {TEMPLATE_DEFINITIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`rounded-lg border p-3 text-left transition ${resume.templateName === item.id ? "border-indigo-300 bg-indigo-50 ring-2 ring-indigo-100" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}
                        onClick={() => update("templateName", item.id)}
                      >
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {item.category}
                        </span>

                        <strong className="mt-1 block text-xs font-semibold text-slate-900">
                          {item.name}
                        </strong>

                        <span className="mt-1 block text-[11px] leading-relaxed text-slate-500">
                          {item.bestFor}
                        </span>
                      </button>
                    ))}
                  </div>
                </Section>
              </>
            )}

            <div className="h-24" />
          </div>
        </aside>

        {/* Resizable divider: wide hit target + small visual divider */}
        <div
          className="no-print relative z-[100] h-full shrink-0"
          style={{
            width: `${DIVIDER_HIT_WIDTH}px`,
            marginLeft: `-${DIVIDER_HIT_WIDTH / 2}px`,
            marginRight: `-${DIVIDER_HIT_WIDTH / 2}px`,
            cursor: "col-resize",
            touchAction: "none",
          }}
          onMouseEnter={() => {
            if (!isDraggingRef.current) {
              document.body.style.cursor = "col-resize";
            }
          }}
          onMouseLeave={() => {
            if (!isDraggingRef.current) {
              document.body.style.cursor = "";
            }
          }}
          onMouseDown={startDragging}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize form and live preview"
          title="Drag to resize"
        >
          <div
            className="absolute inset-0 z-[101]"
            style={{ cursor: "col-resize", touchAction: "none" }}
          />

          <div
            className={`pointer-events-none absolute inset-y-0 left-1/2 z-[102] w-px -translate-x-1/2 transition-colors ${
              isDragging ? "bg-indigo-500" : "bg-slate-300"
            }`}
          />

          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 z-[103] h-12 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity ${
              isDragging
                ? "bg-indigo-500 opacity-100"
                : "bg-slate-400 opacity-0"
            }`}
          />
        </div>

        {/* Live Preview Container */}

        <section className="min-w-0 min-h-0 flex-1 overflow-hidden flex flex-col">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-5 py-3 backdrop-blur">
            <div className="min-w-0">
              <strong className="block truncate text-sm font-semibold text-slate-900">
                {template.name}
              </strong>
              <span className="text-xs text-slate-500">
                Live preview · ATS-friendly
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100"
                  onClick={() => setZoom((z) => Math.max(40, z - 5))}
                >
                  <IconMinus size={14} />
                </button>
                <span className="min-w-[42px] text-center text-xs font-semibold text-slate-700">
                  {zoom}%
                </span>
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100"
                  onClick={() => setZoom((z) => Math.min(100, z + 5))}
                >
                  <IconPlus size={14} />
                </button>
              </div>
            </div>
          </div>

          <div
            className="scroll-slim overflow-auto bg-gradient-to-br from-slate-100 to-slate-200/50 p-10 flex-1"
            style={{ height: "calc(100vh - 4rem - 65px - 57px)" }}
          >
            <div style={{ width: `${794 * (zoom / 100)}px`, margin: "0 auto" }}>
              <div
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top left",
                  width: "794px",
                }}
              >
                <ResumeRenderer resumeData={resume} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {previewOpen ? (
        <div className="fixed inset-0 z-[100] bg-slate-100 lg:hidden">
          <div className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
            <div>
              <strong className="block text-sm font-semibold text-slate-900">
                Resume preview
              </strong>
              <span className="text-[11px] text-slate-500">
                {template.name}
              </span>
            </div>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700"
              onClick={() => setPreviewOpen(false)}
              aria-label="Close preview"
            >
              <IconX size={16} />
            </button>
          </div>

          <div className="scroll-slim overflow-auto p-4 sm:p-6">
            <div className="min-w-max">
              <ResumeRenderer resumeData={resume} />
            </div>
          </div>
        </div>
      ) : null}

      {!hydrated ? (
        <div className="sr-only" aria-hidden="true">
          Loading draft
        </div>
      ) : null}
    </main>
  );
}
