// components/templates/StartupInnovator.jsx
import React from 'react';
import { toArray, sortByPriority, formatDate } from '../../components/utils/resumeHelpers.js';

export default function StartupInnovator({ data }) {
  const { basicInfo, contactInfo, profileSummary, projects, workExperience, awardsAndAchievements } = data;
  const projectList = sortByPriority(toArray(projects?.projects));
  const companies = sortByPriority(toArray(workExperience?.companies));
  const achievements = awardsAndAchievements?.achievements || [];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-zinc-900 text-zinc-100 font-sans border-2 border-emerald-500/30 rounded-xl">
      <div className="flex justify-between items-baseline border-b border-zinc-800 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-emerald-400">{basicInfo?.fullName}</h1>
          <p className="text-sm text-zinc-400">{basicInfo?.position}</p>
        </div>
        <div className="text-right text-xs text-zinc-400 space-y-0.5">
          <p>{contactInfo?.primaryEmail}</p>
          <p>{contactInfo?.portfolio && <a href={contactInfo.portfolio} className="text-emerald-400 underline">Portfolio Link</a>}</p>
        </div>
      </div>

      {/* Projects First */}
      {projectList.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase font-mono tracking-widest text-emerald-400 mb-3">// Key Ventures & Builds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projectList.map((p, i) => (
              <div key={i} className="p-3 bg-zinc-800/60 rounded border border-zinc-700/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-white">Sprint #{i + 1}</span>
                  {p.projectUrl && <a href={p.projectUrl} className="text-emerald-400 text-xs font-mono underline">Live App ↗</a>}
                </div>
                <p className="text-xs text-zinc-300 mb-2">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {p.techStack?.map((t, ti) => (
                    <span key={ti} className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career */}
      {companies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase font-mono tracking-widest text-emerald-400 mb-3">// Track Record</h2>
          {companies.map((c, i) => (
            <div key={i} className="mb-3 text-xs">
              <div className="flex justify-between text-zinc-200 font-bold">
                <span>{c.jobTitle}</span>
                <span className="text-zinc-500 font-mono">{formatDate(c.startDate)} – {c.isPresentJob ? 'Now' : formatDate(c.endDate)}</span>
              </div>
              <p className="text-zinc-400 mt-1">{c.responsibility?.join(' ')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Highlights */}
      {achievements.length > 0 && (
        <div>
          <h2 className="text-xs uppercase font-mono tracking-widest text-emerald-400 mb-2">// Wins</h2>
          <ul className="text-xs text-zinc-300 space-y-1">
            {achievements.map((a, i) => (
              <li key={i}><strong className="text-white">{a.title}:</strong> {a.description}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}