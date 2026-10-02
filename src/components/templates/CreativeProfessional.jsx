// components/templates/CreativeProfessional.jsx
import React from 'react';
import { toArray, sortByPriority, formatDate } from '../../components/utils/resumeHelpers.js';

export default function CreativeProfessional({ data }) {
  const { basicInfo, avatar, contactInfo, profileSummary, projects, workExperience, skills } = data;
  const projectList = sortByPriority(toArray(projects?.projects));
  const companies = sortByPriority(toArray(workExperience?.companies));
  const skillMap = skills?.skills || {};

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white font-sans text-neutral-800">
      <div className="flex justify-between items-start mb-8 pb-8 border-b-4 border-amber-400">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-neutral-900">{basicInfo?.fullName}</h1>
          <p className="text-xl font-medium text-amber-600 mt-1">{basicInfo?.position}</p>
          <div className="mt-3 flex gap-4 text-xs font-semibold text-neutral-500">
            <span>{contactInfo?.primaryEmail}</span>
            <span>{contactInfo?.primaryMobile}</span>
            {contactInfo?.portfolio && <a href={contactInfo.portfolio} className="text-neutral-900 underline">View Portfolio</a>}
          </div>
        </div>
        {avatar?.url && (
          <img src={avatar.url} alt={basicInfo?.fullName} className="w-24 h-24 rounded-full object-cover ring-4 ring-amber-400" />
        )}
      </div>

      {/* Summary */}
      {profileSummary?.objective && (
        <div className="mb-8">
          <p className="text-base text-neutral-600 font-light leading-relaxed">{profileSummary.objective}</p>
        </div>
      )}

      {/* Selected Works */}
      {projectList.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 mb-4">Featured Creative Work</h2>
          <div className="grid grid-cols-2 gap-4">
            {projectList.map((p, i) => (
              <div key={i} className="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-neutral-800 text-sm">Project #{i + 1}</span>
                  {p.projectUrl && <a href={p.projectUrl} className="text-xs text-amber-700 underline font-semibold">Launch</a>}
                </div>
                <p className="text-xs text-neutral-600 mb-3">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {p.skills?.map((s, si) => (
                    <span key={si} className="text-[10px] bg-white px-2 py-0.5 rounded text-neutral-600 border">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {companies.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 mb-4">Work Experience</h2>
          {companies.map((c, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between font-bold text-sm">
                <span>{c.jobTitle}</span>
                <span className="text-xs text-neutral-500 font-normal">{formatDate(c.startDate)} – {c.isPresentJob ? 'Present' : formatDate(c.endDate)}</span>
              </div>
              <ul className="list-disc list-inside text-xs text-neutral-600 mt-1">
                {c.responsibility?.map((r, ri) => <li key={ri}>{r}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}