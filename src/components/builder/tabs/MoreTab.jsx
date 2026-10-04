// components/builder/tabs/MoreTab.jsx
import React from "react";
import {
  IconCheck,
  IconFileText,
  IconPlus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { Field, Section } from "../controls/FormControls";
import { TEMPLATE_DEFINITIONS, COLOR_PALETTES } from "@/lib/resume-data";

export default function MoreTab({ resume, update, setResume }) {
  const certEntries = Object.entries(resume.certifications?.certificates || {});
  const pubEntries = Object.entries(resume.publications?.publications || {});

  // Find the active template's definition to know its avatar mode
  const currentTemplateDef =
    TEMPLATE_DEFINITIONS.find((t) => t.id === resume.templateName) ||
    TEMPLATE_DEFINITIONS[0];

  // Strictly filter templates:
  // If active template has avatar -> show ONLY avatar templates
  // If active template does NOT have avatar -> show ONLY text-based ATS templates
  const availableTemplates = TEMPLATE_DEFINITIONS.filter(
    (t) => Boolean(t.hasAvatar) === Boolean(currentTemplateDef.hasAvatar)
  );

  const handleCertificateUpload = (id, file) => {
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setResume((current) => ({
      ...current,
      certifications: {
        ...current.certifications,
        certificates: {
          ...current.certifications.certificates,
          [id]: {
            ...current.certifications.certificates[id],
            certificateContent: {
              title: file.name,
              url: localUrl,
              key: `cert-${file.name}`,
            },
          },
        },
      },
    }));
  };

  const handlePublicationUpload = (id, file) => {
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setResume((current) => ({
      ...current,
      publications: {
        ...current.publications,
        publications: {
          ...current.publications.publications,
          [id]: {
            ...current.publications.publications[id],
            publicationReference: [
              {
                title: file.name,
                accessUrl: { url: localUrl, key: `pub-${file.name}` },
              },
            ],
          },
        },
      },
    }));
  };

  return (
    <>
      {/* 1. Template & Dynamic Color Picker */}
      <Section title="Design & Template" description="Select your layout and color palette">
        {/* Color Palette Selector */}
        <div className="mb-4">
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Accent Theme Color
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {COLOR_PALETTES.map((color) => {
              const active = resume.themeColor === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => update("themeColor", color.id)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? "border-slate-800 bg-slate-900 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                  {active && <IconCheck size={12} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtered Template Cards */}
        <div>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {currentTemplateDef.hasAvatar
              ? "Available Formats (With Avatar)"
              : "Available Formats (100% Strict ATS Text-Only)"}
          </span>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {availableTemplates.map((t) => {
              const isSelected = resume.templateName === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => update("templateName", t.id)}
                  className={`rounded-lg border p-3 text-left transition ${
                    isSelected
                      ? "border-indigo-400 bg-indigo-50/70 ring-2 ring-indigo-100"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {t.category}
                    </span>
                    {t.hasAvatar ? (
                      <span className="rounded bg-indigo-100 px-1 py-0.5 text-[9px] font-semibold text-indigo-700">
                        Avatar
                      </span>
                    ) : (
                      <span className="rounded bg-emerald-100 px-1 py-0.5 text-[9px] font-semibold text-emerald-800">
                        100% ATS
                      </span>
                    )}
                  </div>
                  <strong className="mt-1 block text-xs font-semibold text-slate-900">
                    {t.name}
                  </strong>
                  <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-2">
                    {t.bestFor}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      {/* 2. Optional Certifications Upload Section */}
      <Section title="Certificates" description="Add certification credentials & documents">
        <div className="grid gap-3">
          {certEntries.map(([id, cert], index) => (
            <div
              key={id}
              className="grid gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
            >
              <div className="flex items-center justify-between">
                <strong className="text-xs font-semibold text-slate-800">
                  Certificate #{index + 1}
                </strong>
                <button
                  type="button"
                  onClick={() =>
                    setResume((r) => {
                      const next = { ...r.certifications.certificates };
                      delete next[id];
                      return {
                        ...r,
                        certifications: { ...r.certifications, certificates: next },
                      };
                    })
                  }
                  className="text-rose-500 hover:text-rose-700"
                >
                  <IconTrash size={14} />
                </button>
              </div>

              <Field
                label="Certificate Name"
                value={cert.overview}
                onChange={(v) =>
                  setResume((r) => ({
                    ...r,
                    certifications: {
                      ...r.certifications,
                      certificates: {
                        ...r.certifications.certificates,
                        [id]: { ...cert, overview: v },
                      },
                    },
                  }))
                }
                placeholder="AWS Certified Developer"
              />

              <div className="grid grid-cols-2 gap-2">
                <Field
                  label="Duration"
                  value={cert.duration}
                  onChange={(v) =>
                    setResume((r) => ({
                      ...r,
                      certifications: {
                        ...r.certifications,
                        certificates: {
                          ...r.certifications.certificates,
                          [id]: { ...cert, duration: v },
                        },
                      },
                    }))
                  }
                  placeholder="3 months"
                />
                <Field
                  label="Skills Learned"
                  value={cert.skillLearned?.join(", ")}
                  onChange={(v) =>
                    setResume((r) => ({
                      ...r,
                      certifications: {
                        ...r.certifications,
                        certificates: {
                          ...r.certifications.certificates,
                          [id]: {
                            ...cert,
                            skillLearned: v.split(",").map((s) => s.trim()).filter(Boolean),
                          },
                        },
                      },
                    }))
                  }
                  placeholder="AWS, Docker"
                />
              </div>

              <div className="mt-1 flex items-center justify-between rounded-lg border border-dashed border-slate-300 bg-white p-2.5">
                <div className="flex items-center gap-2 overflow-hidden">
                  <IconFileText size={16} className="shrink-0 text-slate-500" />
                  <span className="truncate text-xs text-slate-600">
                    {cert.certificateContent?.title || "No document attached (Optional)"}
                  </span>
                </div>
                <label className="cursor-pointer rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                  <IconUpload size={12} className="inline mr-1" /> Attach PDF
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg"
                    className="hidden"
                    onChange={(e) => handleCertificateUpload(id, e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/60 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
            onClick={() => {
              const id = `cert-${Date.now()}`;
              setResume((r) => ({
                ...r,
                certifications: {
                  ...r.certifications,
                  certificates: {
                    ...(r.certifications?.certificates || {}),
                    [id]: {
                      priority: Object.keys(r.certifications?.certificates || {}).length + 1,
                      overview: "",
                      skillLearned: [],
                      duration: "",
                      certificateContent: { title: "", url: "", key: "" },
                    },
                  },
                },
              }));
            }}
          >
            <IconPlus size={14} /> Add Certificate
          </button>
        </div>
      </Section>

      {/* 3. Optional Publications Upload Section */}
      <Section title="Publications" description="Research papers, articles and reference docs">
        <div className="grid gap-3">
          {pubEntries.map(([id, pub], index) => (
            <div
              key={id}
              className="grid gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
            >
              <div className="flex items-center justify-between">
                <strong className="text-xs font-semibold text-slate-800">
                  Publication #{index + 1}
                </strong>
                <button
                  type="button"
                  onClick={() =>
                    setResume((r) => {
                      const next = { ...r.publications.publications };
                      delete next[id];
                      return {
                        ...r,
                        publications: { ...r.publications, publications: next },
                      };
                    })
                  }
                  className="text-rose-500 hover:text-rose-700"
                >
                  <IconTrash size={14} />
                </button>
              </div>

              <Field
                label="Description / Title"
                value={pub.description}
                onChange={(v) =>
                  setResume((r) => ({
                    ...r,
                    publications: {
                      ...r.publications,
                      publications: {
                        ...r.publications.publications,
                        [id]: { ...pub, description: v },
                      },
                    },
                  }))
                }
                placeholder="Distributed Systems Paper (IEEE 2025)"
              />

              <Field
                label="Reference URL"
                value={pub.referenceUrl}
                onChange={(v) =>
                  setResume((r) => ({
                    ...r,
                    publications: {
                      ...r.publications,
                      publications: {
                        ...r.publications.publications,
                        [id]: { ...pub, referenceUrl: v },
                      },
                    },
                  }))
                }
                placeholder="https://doi.org/..."
              />

              <div className="mt-1 flex items-center justify-between rounded-lg border border-dashed border-slate-300 bg-white p-2.5">
                <div className="flex items-center gap-2 overflow-hidden">
                  <IconFileText size={16} className="shrink-0 text-slate-500" />
                  <span className="truncate text-xs text-slate-600">
                    {pub.publicationReference?.[0]?.title || "No document attached (Optional)"}
                  </span>
                </div>
                <label className="cursor-pointer rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                  <IconUpload size={12} className="inline mr-1" /> Attach Paper PDF
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handlePublicationUpload(id, e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/60 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
            onClick={() => {
              const id = `pub-${Date.now()}`;
              setResume((r) => ({
                ...r,
                publications: {
                  ...r.publications,
                  publications: {
                    ...(r.publications?.publications || {}),
                    [id]: {
                      priority: Object.keys(r.publications?.publications || {}).length + 1,
                      description: "",
                      referenceUrl: "",
                      publicationReference: [],
                    },
                  },
                },
              }));
            }}
          >
            <IconPlus size={14} /> Add Publication
          </button>
        </div>
      </Section>
    </>
  );
}