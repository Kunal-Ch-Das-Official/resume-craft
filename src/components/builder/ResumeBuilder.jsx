// components/builder/ResumeBuilder.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconBriefcase,
  IconCode,
  IconDeviceFloppy,
  IconEye,
  IconEdit,
  IconFolderCode,
  IconLayoutGrid,
  IconMinus,
  IconPlus,
  IconPrinter,
  IconRefresh,
  IconSchool,
  IconSparkles,
  IconTrash,
  IconUserCircle,
  IconWand,
} from "@tabler/icons-react";

import ResumeRenderer from "@/components/ResumeRenderer";
import {
  DEMO_RESUME,
  EMPTY_RESUME,
  TEMPLATE_DEFINITIONS,
  cloneResume,
} from "@/lib/resume-data";

import { useResizablePane } from "@/hooks/useResizablePane";
import BasicsTab from "./tabs/BasicsTab";
import MoreTab from "./tabs/MoreTab";
import { Field, AreaField, Section } from "./controls/FormControls";

const tabs = [
  ["Basics", IconUserCircle],
  ["Experience", IconBriefcase],
  ["Education", IconSchool],
  ["Skills", IconCode],
  ["Projects", IconFolderCode],
  ["More", IconLayoutGrid],
];

export default function ResumeBuilder({
  initialTemplate = "clean-ats-optimizer",
}) {
  // 1. Resolve safe initial template
  const validInitial = useMemo(() => {
    return TEMPLATE_DEFINITIONS.some((item) => item.id === initialTemplate)
      ? initialTemplate
      : "clean-ats-optimizer";
  }, [initialTemplate]);

  // 2. React Hooks & State Declarations (Must precede any setters)
  const [resume, setResume] = useState(() => ({
    ...cloneResume(DEMO_RESUME),
    templateName: validInitial,
  }));

  const [activeTab, setActiveTab] = useState("Basics");
  const [saved, setSaved] = useState(false);
  const [mobileMode, setMobileMode] = useState("edit"); // "edit" | "preview"
  const [zoom, setZoom] = useState(60);
  const [hydrated, setHydrated] = useState(false);

  // 3. Horizontal resizer hook
  const { formWidth, isDragging, editorRef, startDragging, DIVIDER_HIT_WIDTH } =
    useResizablePane(650);

  // 4. Hydrate once from localStorage on initial mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("resumecraft-draft");
      if (raw) {
        const parsed = JSON.parse(raw);
        // Prioritize explicit URL template parameter over cached draft
        const chosenTemplate =
          initialTemplate &&
          TEMPLATE_DEFINITIONS.some((t) => t.id === initialTemplate)
            ? initialTemplate
            : parsed.templateName || validInitial;

        setResume({
          ...parsed,
          templateName: chosenTemplate,
        });
      }
    } catch {
      // Ignore corrupted draft storage
    } finally {
      setHydrated(true);
    }
  }, [initialTemplate, validInitial]);

  // 5. Reactively sync when initialTemplate changes via client router
  useEffect(() => {
    setResume((current) => {
      if (current.templateName !== validInitial) {
        return { ...current, templateName: validInitial };
      }
      return current;
    });
  }, [validInitial]);

  // Deep immutable updates ensuring React re-renders live on every keystroke
  const update = (path, value) => {
    setResume((current) => {
      const next = cloneResume(current);
      const keys = path.split(".");
      const last = keys.pop();
      let target = next;
      for (const key of keys) {
        target[key] = { ...(target[key] || {}) };
        target = target[key];
      }
      target[last] = value;
      return next;
    });
  };

  const setMapItem = (root, collectionKey, id, field, value) => {
    setResume((current) => {
      const next = cloneResume(current);
      if (!next[root]) next[root] = {};
      if (!next[root][collectionKey]) next[root][collectionKey] = {};
      if (!next[root][collectionKey][id]) next[root][collectionKey][id] = {};
      next[root][collectionKey][id][field] = value;
      return next;
    });
  };

  const saveDraft = () => {
    window.localStorage.setItem("resumecraft-draft", JSON.stringify(resume));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
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

  const currentTemplate = useMemo(
    () =>
      TEMPLATE_DEFINITIONS.find((item) => item.id === resume.templateName) ||
      TEMPLATE_DEFINITIONS[0],
    [resume.templateName],
  );

  return (
    <>
      {/* ================= SCREEN-ONLY EDITOR LAYOUT ================= */}
      <div className="no-print min-h-screen bg-slate-100/60 pb-12 lg:pb-0">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 sm:px-6">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 sm:text-[11px]">
                <IconSparkles size={13} />
                Production Editor
              </div>
              <h1 className="truncate text-base font-extrabold text-slate-900 sm:text-xl">
                Build your resume
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm lg:hidden"
                onClick={() =>
                  setMobileMode((m) => (m === "edit" ? "preview" : "edit"))
                }
              >
                {mobileMode === "edit" ? (
                  <>
                    <IconEye size={14} /> Preview
                  </>
                ) : (
                  <>
                    <IconEdit size={14} /> Form
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={loadDemo}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <IconWand size={14} />
                <span className="hidden sm:inline">Sample</span>
              </button>

              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <IconRefresh size={14} />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                type="button"
                onClick={print}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <IconPrinter size={14} />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={saveDraft}
                className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 active:scale-95"
              >
                <IconDeviceFloppy size={14} />
                <span>{saved ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block lg:hidden w-full">
          {mobileMode === "edit" ? (
            <div className="bg-white p-3">
              <div className="sticky top-[53px] z-20 flex gap-1 overflow-x-auto border-b border-slate-200 bg-white py-2 scroll-slim">
                {tabs.map(([name, Icon]) => (
                  <button
                    key={name}
                    type="button"
                    className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      activeTab === name
                        ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                    onClick={() => setActiveTab(name)}
                  >
                    <Icon size={14} />
                    {name}
                  </button>
                ))}
              </div>

              <div className="mt-3">
                {activeTab === "Basics" && (
                  <BasicsTab resume={resume} update={update} />
                )}
                {activeTab === "Experience" && (
                  <Section
                    title="Work Experience"
                    description="Your professional history"
                  >
                    {renderExperienceForm()}
                  </Section>
                )}
                {activeTab === "Education" && (
                  <Section
                    title="Education"
                    description="Degrees and schooling"
                  >
                    {renderEducationForm()}
                  </Section>
                )}
                {activeTab === "Skills" && (
                  <Section title="Skills" description="Core competencies">
                    {renderSkillsForm()}
                  </Section>
                )}
                {activeTab === "Projects" && (
                  <Section
                    title="Projects"
                    description="Key builds and deliverables"
                  >
                    {renderProjectsForm()}
                  </Section>
                )}
                {activeTab === "More" && (
                  <MoreTab
                    resume={resume}
                    update={update}
                    setResume={setResume}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-200 min-h-screen overflow-x-auto flex justify-center">
              <div className="min-w-[794px] bg-white shadow-xl origin-top transform scale-[0.45] sm:scale-[0.6]">
                <ResumeRenderer resumeData={resume} />
              </div>
            </div>
          )}
        </div>

        {/* Desktop Split Workspace */}
        <div
          ref={editorRef}
          className="hidden lg:flex w-full min-w-0 overflow-hidden"
          style={{ height: "calc(100vh - 54px)" }}
        >
          {/* Left Panel */}
          <aside
            className="border-r border-slate-200 bg-white shrink-0 overflow-hidden flex flex-col"
            style={{ width: `${formWidth}px` }}
          >
            <div className="sticky top-0 z-10 flex gap-1 overflow-x-auto border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur scroll-slim">
              {tabs.map(([name, Icon]) => (
                <button
                  key={name}
                  type="button"
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    activeTab === name
                      ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  onClick={() => setActiveTab(name)}
                >
                  <Icon size={14} />
                  {name}
                </button>
              ))}
            </div>

            <div
              className="scroll-slim overflow-y-auto flex-1 p-2"
              style={{ maxHeight: "calc(100vh - 54px - 49px)" }}
            >
              {activeTab === "Basics" && (
                <BasicsTab resume={resume} update={update} />
              )}
              {activeTab === "Experience" && (
                <Section
                  title="Work Experience"
                  description="Your professional history"
                >
                  {renderExperienceForm()}
                </Section>
              )}
              {activeTab === "Education" && (
                <Section
                  title="Education"
                  description="Degrees and qualifications"
                >
                  {renderEducationForm()}
                </Section>
              )}
              {activeTab === "Skills" && (
                <Section
                  title="Skills"
                  description="Core technical competencies"
                >
                  {renderSkillsForm()}
                </Section>
              )}
              {activeTab === "Projects" && (
                <Section
                  title="Projects"
                  description="Key builds and deliverables"
                >
                  {renderProjectsForm()}
                </Section>
              )}
              {activeTab === "More" && (
                <MoreTab
                  resume={resume}
                  update={update}
                  setResume={setResume}
                />
              )}
              <div className="h-16" />
            </div>
          </aside>

          {/* Draggable Divider */}
          <div
            className="relative z-[100] h-full shrink-0"
            style={{
              width: `${DIVIDER_HIT_WIDTH}px`,
              marginLeft: `-${DIVIDER_HIT_WIDTH / 2}px`,
              marginRight: `-${DIVIDER_HIT_WIDTH / 2}px`,
              cursor: "col-resize",
              touchAction: "none",
            }}
            onMouseDown={startDragging}
            role="separator"
          >
            <div
              className="absolute inset-0 z-[101]"
              style={{ cursor: "col-resize" }}
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

          {/* Right Live Preview Canvas */}
          <section className="min-w-0 min-h-0 flex-1 overflow-hidden flex flex-col">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-2.5 backdrop-blur">
              <div className="min-w-0">
                <strong className="block truncate text-xs font-semibold text-slate-900 sm:text-sm">
                  {currentTemplate.name}
                </strong>
                <span className="text-[11px] text-slate-500">
                  Live preview ·{" "}
                  {currentTemplate.hasAvatar
                    ? "ATS with Avatar"
                    : "100% Text ATS"}
                </span>
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded text-slate-700 hover:bg-slate-100"
                  onClick={() => setZoom((z) => Math.max(35, z - 5))}
                >
                  <IconMinus size={13} />
                </button>
                <span className="min-w-[36px] text-center text-xs font-semibold text-slate-700">
                  {zoom}%
                </span>
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded text-slate-700 hover:bg-slate-100"
                  onClick={() => setZoom((z) => Math.min(100, z + 5))}
                >
                  <IconPlus size={13} />
                </button>
              </div>
            </div>

            <div
              className="scroll-slim overflow-auto bg-gradient-to-br from-slate-100 to-slate-200/50 p-6 flex-1"
              style={{ height: "calc(100vh - 54px - 45px)" }}
            >
              <div
                style={{ width: `${794 * (zoom / 100)}px`, margin: "0 auto" }}
              >
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
      </div>

      {/* ================= PURE PRINT TARGET (HIDDEN ON SCREEN, REVEALED IN PRINT) ================= */}
      <div id="resume-print-area" className="hidden print:block">
        <ResumeRenderer resumeData={resume} />
      </div>

      {!hydrated && <div className="sr-only">Hydrating draft...</div>}
    </>
  );

  // --- Sub-Form Renderers with live bindings ---
  function renderExperienceForm() {
    return (
      <div className="grid gap-3">
        {experienceEntries.map(([id, item], index) => (
          <div
            key={id}
            className="grid gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5"
          >
            <div className="flex items-center justify-between">
              <strong className="text-xs font-semibold text-slate-900">
                Experience #{index + 1}
              </strong>
              <button
                type="button"
                className="text-rose-600 hover:text-rose-800"
                onClick={() =>
                  setResume((c) => {
                    const next = { ...c.workExperience.companies };
                    delete next[id];
                    return {
                      ...c,
                      workExperience: { ...c.workExperience, companies: next },
                    };
                  })
                }
              >
                <IconTrash size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Field
                label="Job title"
                value={item.jobTitle}
                onChange={(v) =>
                  setMapItem("workExperience", "companies", id, "jobTitle", v)
                }
                placeholder="Senior Backend Engineer"
              />
              <Field
                label="Company"
                value={item.companyName}
                onChange={(v) =>
                  setMapItem(
                    "workExperience",
                    "companies",
                    id,
                    "companyName",
                    v,
                  )
                }
                placeholder="Company Name"
              />
              <Field
                label="Start Date"
                type="month"
                value={item.startDate}
                onChange={(v) =>
                  setMapItem("workExperience", "companies", id, "startDate", v)
                }
              />
              <Field
                label="End Date"
                type="month"
                value={item.endDate}
                onChange={(v) =>
                  setMapItem("workExperience", "companies", id, "endDate", v)
                }
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
              Currently working here
            </label>

            <AreaField
              label="Responsibilities (One bullet per line)"
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
              placeholder="Architected streaming microservices..."
            />
          </div>
        ))}

        <button
          type="button"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/60 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
          onClick={() => {
            const id = `comp-${Date.now()}`;
            setResume((c) => ({
              ...c,
              workExperience: {
                ...c.workExperience,
                companies: {
                  ...(c.workExperience?.companies || {}),
                  [id]: {
                    priority:
                      Object.keys(c.workExperience?.companies || {}).length + 1,
                    jobTitle: "",
                    companyName: "",
                    jobConditions: "REMOTE",
                    jobTypes: "FULL_TIME",
                    jobLocation: "Pune, India",
                    responsibility: [""],
                    startDate: "",
                    endDate: "",
                    isPresentJob: true,
                  },
                },
              },
            }));
          }}
        >
          <IconPlus size={14} /> Add Experience
        </button>
      </div>
    );
  }

  function renderEducationForm() {
    return (
      <div className="grid gap-3">
        {educationEntries.map(([id, item], index) => (
          <div
            key={id}
            className="grid gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5"
          >
            <div className="flex items-center justify-between">
              <strong className="text-xs font-semibold text-slate-900">
                Education #{index + 1}
              </strong>
              <button
                type="button"
                className="text-rose-600 hover:text-rose-800"
                onClick={() =>
                  setResume((c) => {
                    const next = { ...c.educations.qualifications };
                    delete next[id];
                    return {
                      ...c,
                      educations: { ...c.educations, qualifications: next },
                    };
                  })
                }
              >
                <IconTrash size={14} />
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
              placeholder="Institute Name"
            />
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Started At"
                type="month"
                value={item.startedAt}
                onChange={(v) =>
                  setMapItem("educations", "qualifications", id, "startedAt", v)
                }
              />
              <Field
                label="Year of Complete"
                type="month"
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
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Degree / Major"
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
                placeholder="B.Tech Computer Science"
              />
              <Field
                label="Marks / CGPA"
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
                placeholder="8.8 CGPA"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/60 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
          onClick={() => {
            const id = `edu-${Date.now()}`;
            setResume((c) => ({
              ...c,
              educations: {
                ...c.educations,
                qualifications: {
                  ...(c.educations?.qualifications || {}),
                  [id]: {
                    priority:
                      Object.keys(c.educations?.qualifications || {}).length +
                      1,
                    institutionName: "",
                    startedAt: "",
                    yearOfComplete: "",
                    pursuing: false,
                    percentage: "",
                    description: "",
                  },
                },
              },
            }));
          }}
        >
          <IconPlus size={14} /> Add Education
        </button>
      </div>
    );
  }

  function renderSkillsForm() {
    return (
      <div className="grid gap-3">
        {skillGroups.map(([group, skills]) => (
          <div
            key={group}
            className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5"
          >
            <div className="flex items-center justify-between">
              <strong className="text-xs font-semibold text-slate-800">
                {group}
              </strong>
              <button
                type="button"
                className="text-rose-500 hover:text-rose-700"
                onClick={() =>
                  setResume((r) => {
                    const next = { ...r.skills.skills };
                    delete next[group];
                    return { ...r, skills: { ...r.skills, skills: next } };
                  })
                }
              >
                <IconTrash size={14} />
              </button>
            </div>
            <Field
              label="Category Name"
              value={group}
              onChange={(v) =>
                setResume((r) => {
                  const next = { ...r.skills.skills };
                  delete next[group];
                  next[v || "New Category"] = skills;
                  return { ...r, skills: { ...r.skills, skills: next } };
                })
              }
            />
            <Field
              label="Skills (Comma-separated)"
              value={skills.join(", ")}
              onChange={(v) =>
                update(
                  `skills.skills.${group}`,
                  v
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
              placeholder="TypeScript, Node.js, MongoDB"
            />
          </div>
        ))}

        <button
          type="button"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/60 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
          onClick={() =>
            setResume((r) => ({
              ...r,
              skills: {
                ...r.skills,
                skills: {
                  ...r.skills.skills,
                  [`Skill Group ${Object.keys(r.skills.skills || {}).length + 1}`]:
                    [],
                },
              },
            }))
          }
        >
          <IconPlus size={14} /> Add Skill Group
        </button>
      </div>
    );
  }

  function renderProjectsForm() {
    return (
      <div className="grid gap-3">
        {projectEntries.map(([id, item], index) => (
          <div
            key={id}
            className="grid gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5"
          >
            <div className="flex items-center justify-between">
              <strong className="text-xs font-semibold text-slate-900">
                Project #{index + 1}
              </strong>
              <button
                type="button"
                className="text-rose-600 hover:text-rose-800"
                onClick={() =>
                  setResume((c) => {
                    const next = { ...c.projects.projects };
                    delete next[id];
                    return {
                      ...c,
                      projects: { ...c.projects, projects: next },
                    };
                  })
                }
              >
                <IconTrash size={14} />
              </button>
            </div>

            <Field
              label="Project name"
              value={item.name}
              onChange={(v) =>
                setMapItem("projects", "projects", id, "name", v)
              }
              placeholder="Project Name"
            />
            <AreaField
              label="Description"
              value={item.description}
              onChange={(v) =>
                setMapItem("projects", "projects", id, "description", v)
              }
              placeholder="Engineered high throughput API..."
            />
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Start Date"
                type="month"
                value={item.startDate}
                onChange={(v) =>
                  setMapItem("projects", "projects", id, "startDate", v)
                }
              />
              <Field
                label="End Date"
                type="month"
                value={item.endDate}
                onChange={(v) =>
                  setMapItem("projects", "projects", id, "endDate", v)
                }
              />
            </div>
            <Field
              label="Project URL"
              value={item.projectUrl}
              onChange={(v) =>
                setMapItem("projects", "projects", id, "projectUrl", v)
              }
              placeholder="https://github.com/..."
            />
            <Field
              label="Tech Stack (Comma-separated)"
              value={(item.techStack || []).join(", ")}
              onChange={(v) =>
                setMapItem(
                  "projects",
                  "projects",
                  id,
                  "techStack",
                  v
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
              placeholder="Node.js, Docker, Redis"
            />
          </div>
        ))}

        <button
          type="button"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/60 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
          onClick={() => {
            const id = `proj-${Date.now()}`;
            setResume((c) => ({
              ...c,
              projects: {
                ...c.projects,
                projects: {
                  ...(c.projects?.projects || {}),
                  [id]: {
                    priority:
                      Object.keys(c.projects?.projects || {}).length + 1,
                    name: "",
                    description: "",
                    projectUrl: "",
                    startDate: "",
                    endDate: "",
                    isWorking: true,
                    techStack: [],
                    skills: [],
                  },
                },
              },
            }));
          }}
        >
          <IconPlus size={14} /> Add Project
        </button>
      </div>
    );
  }
}
