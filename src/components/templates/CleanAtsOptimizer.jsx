// components/templates/CleanAtsOptimizer.jsx
import React from 'react';
import { toArray, sortByPriority, formatDate } from '../../components/utils/resumeHelpers.js';

export default function CleanAtsOptimizer({ data }) {
  const { basicInfo, address, contactInfo, profileSummary, workExperience, educations, skills } = data;
  const companies = sortByPriority(toArray(workExperience?.companies));
  const qualifications = sortByPriority(toArray(educations?.qualifications));
  const skillMap = skills?.skills || {};

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white text-black font-sans leading-tight text-xs">
      <div className="text-center pb-2 mb-4 border-b border-black">
        <h1 className="text-xl font-bold uppercase mb-1">{basicInfo?.fullName}</h1>
        <div>{basicInfo?.position}</div>
        <div className="mt-1">
          {address?.city}, {address?.country} | {contactInfo?.primaryMobile} | {contactInfo?.primaryEmail}
        </div>
      </div>

      {profileSummary?.objective && (
        <div className="mb-4">
          <h2 className="font-bold uppercase border-b border-gray-400 mb-1">Summary</h2>
          <p>{profileSummary.objective}</p>
        </div>
      )}

      {companies.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase border-b border-gray-400 mb-2">Work Experience</h2>
          {companies.map((c, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between font-bold">
                <span>{c.jobTitle} — {c.jobLocation}</span>
                <span>{formatDate(c.startDate)} to {c.isPresentJob ? 'Present' : formatDate(c.endDate)}</span>
              </div>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                {c.responsibility?.map((r, ri) => <li key={ri}>{r}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {qualifications.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase border-b border-gray-400 mb-2">Education</h2>
          {qualifications.map((q, i) => (
            <div key={i} className="flex justify-between mb-1">
              <span><strong>{q.institutionName}</strong> — {q.description}</span>
              <span>{formatDate(q.startedAt)} – {formatDate(q.yearOfComplete)}</span>
            </div>
          ))}
        </div>
      )}

      {Object.keys(skillMap).length > 0 && (
        <div>
          <h2 className="font-bold uppercase border-b border-gray-400 mb-1">Skills</h2>
          {Object.entries(skillMap).map(([category, list], i) => (
            <p key={i}><strong>{category}:</strong> {Array.isArray(list) ? list.join(', ') : list}</p>
          ))}
        </div>
      )}
    </div>
  );
}