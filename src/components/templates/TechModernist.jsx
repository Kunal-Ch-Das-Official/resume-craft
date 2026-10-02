// components/templates/TechModernist.jsx
import React from "react";
import { toArray, sortByPriority, formatDate } from '../../components/utils/resumeHelpers.js';

export default function TechModernist({ data }) {
  const {
    basicInfo,
    avatar,
    address,
    contactInfo,
    profileSummary,
    workExperience,
    projects,
    educations,
    certifications,
    skills,
    openSource,
  } = data;

  const companies = sortByPriority(toArray(workExperience?.companies));
  const projectList = sortByPriority(toArray(projects?.projects));
  const openSourceList = sortByPriority(toArray(openSource?.contributions));
  const qualifications = sortByPriority(toArray(educations?.qualifications));
  const skillMap = skills?.skills || {};

  return (
    <div className="max-w-4xl mx-auto p-8 bg-slate-50 text-slate-800 font-sans border-t-8 border-cyan-600">
      {/* Header */}
      <div className="flex items-center gap-6 pb-6 border-b border-slate-200 mb-6">
        {avatar?.url && (
          <img
            src={avatar.url}
            alt={basicInfo?.fullName}
            className="w-24 h-24 rounded-lg object-cover border-2 border-cyan-600 shadow-sm"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {basicInfo?.fullName}
          </h1>
          <p className="text-lg font-semibold text-cyan-700">
            {basicInfo?.position}
          </p>
          <div className="text-xs text-slate-500 mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <span>
              📍 {address?.city}, {address?.country}
            </span>
            <span>✉️ {contactInfo?.primaryEmail}</span>
            <span>📞 {contactInfo?.primaryMobile}</span>
            {contactInfo?.github && (
              <a href={contactInfo.github} className="text-cyan-600 underline">
                GitHub
              </a>
            )}
            {contactInfo?.portfolio && (
              <a
                href={contactInfo.portfolio}
                className="text-cyan-600 underline"
              >
                Portfolio
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tech Stack Matrix */}
      {Object.keys(skillMap).length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            {skills?.sectionTitle || "Technical Competencies"}
          </h2>
          <div className="space-y-2 text-sm">
            {Object.entries(skillMap).map(([category, items], i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-700 min-w-28 text-xs uppercase">
                  {category}:
                </span>
                {Array.isArray(items) &&
                  items.map((tag, ti) => (
                    <span
                      key={ti}
                      className="bg-cyan-50 text-cyan-800 text-xs px-2 py-0.5 rounded font-mono font-medium border border-cyan-200"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {companies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900 border-b-2 border-cyan-600 pb-1 mb-4">
            {workExperience?.sectionTitle || "Engineering Experience"}
          </h2>
          <div className="space-y-4">
            {companies.map((c, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded border border-slate-200 shadow-xs"
              >
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-800">{c.jobTitle}</h3>
                  <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {formatDate(c.startDate)} –{" "}
                    {c.isPresentJob ? "Present" : formatDate(c.endDate)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">
                  {c.jobLocation} • {c.jobTypes} • {c.jobConditions}
                </p>
                {c.responsibility && (
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    {c.responsibility.map((r, ri) => (
                      <li key={ri}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Projects */}
      {projectList.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900 border-b-2 border-cyan-600 pb-1 mb-4">
            {projects?.sectionTitle || "Technical Projects"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectList.map((p, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-slate-900">
                      Project #{i + 1}
                    </span>
                    {p.projectUrl && (
                      <a
                        href={p.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-cyan-600 underline"
                      >
                        Live Link
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{p.description}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {p.techStack?.map((t, ti) => (
                      <span
                        key={ti}
                        className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open Source */}
      {openSourceList.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900 border-b-2 border-cyan-600 pb-1 mb-3">
            {openSource?.sectionTitle || "Open Source Contributions"}
          </h2>
          <div className="space-y-2">
            {openSourceList.map((os, i) => (
              <div
                key={i}
                className="text-xs bg-white p-3 rounded border border-slate-200 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-slate-800">{os.description}</p>
                  {os.duration && (
                    <span className="text-slate-400">
                      Duration: {os.duration}
                    </span>
                  )}
                </div>
                {os.githubUrl && (
                  <a
                    href={os.githubUrl}
                    className="text-cyan-600 font-mono underline ml-4"
                  >
                    GitHub Repo
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {qualifications.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-slate-900 border-b-2 border-cyan-600 pb-1 mb-3">
            {educations?.sectionTitle || "Education"}
          </h2>
          {qualifications.map((q, i) => (
            <div key={i} className="flex justify-between text-xs mb-2">
              <span className="font-semibold text-slate-800">
                {q.institutionName}
              </span>
              <span className="text-slate-500 font-mono">
                {formatDate(q.startedAt)} – {formatDate(q.yearOfComplete)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
