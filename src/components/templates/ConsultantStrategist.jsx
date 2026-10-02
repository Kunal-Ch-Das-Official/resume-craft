// components/templates/ConsultantStrategist.jsx
import React from 'react';
import { toArray, sortByPriority, formatDate } from '../../components/utils/resumeHelpers.js';

export default function ConsultantStrategist({ data }) {
  const { basicInfo, address, contactInfo, profileSummary, workExperience, skills, educations } = data;
  const companies = sortByPriority(toArray(workExperience?.companies));
  const qualifications = sortByPriority(toArray(educations?.qualifications));
  const skillMap = skills?.skills || {};

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white font-sans text-neutral-800 border-l-8 border-blue-900">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-blue-900">{basicInfo?.fullName}</h1>
        <p className="text-base text-neutral-600 uppercase font-semibold tracking-wide">{basicInfo?.position}</p>
        <p className="text-xs text-neutral-500 mt-1">{address?.city}, {address?.country} | {contactInfo?.primaryEmail} | {contactInfo?.primaryMobile}</p>
      </div>

      {profileSummary?.objective && (
        <div className="mb-6 bg-neutral-50 p-4 border border-neutral-200">
          <h2 className="text-xs uppercase font-bold text-blue-900 mb-1">Executive Briefing</h2>
          <p className="text-xs text-neutral-700 leading-relaxed">{profileSummary.objective}</p>
        </div>
      )}

      {companies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase font-bold text-blue-900 border-b-2 border-blue-900 pb-1 mb-3">Client Engagements & Experience</h2>
          {companies.map((c, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between text-xs font-bold text-neutral-900">
                <span>{c.jobTitle} ({c.jobLocation})</span>
                <span>{formatDate(c.startDate)} – {c.isPresentJob ? 'Present' : formatDate(c.endDate)}</span>
              </div>
              <ul className="list-disc list-inside text-xs text-neutral-700 mt-1 space-y-1">
                {c.responsibility?.map((r, ri) => <li key={ri}>{r}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {Object.keys(skillMap).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase font-bold text-blue-900 border-b-2 border-blue-900 pb-1 mb-2">Domain Capabilities</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(skillMap).map(([k, v], i) => (
              <div key={i}><strong>{k}:</strong> {Array.isArray(v) ? v.join(', ') : v}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}