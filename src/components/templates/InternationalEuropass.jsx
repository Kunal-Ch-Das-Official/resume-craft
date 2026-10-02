// components/templates/InternationalEuropass.jsx
import React from 'react';
import { toArray, sortByPriority, formatDate } from '../../components/utils/resumeHelpers.js';

export default function InternationalEuropass({ data }) {
  const { basicInfo, avatar, address, contactInfo, workExperience, educations, languageProficiency } = data;
  const companies = sortByPriority(toArray(workExperience?.companies));
  const qualifications = sortByPriority(toArray(educations?.qualifications));

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white font-sans text-slate-800 text-xs">
      {/* Europass Header */}
      <div className="flex gap-6 border-b-2 border-blue-800 pb-6 mb-6">
        {avatar?.url && (
          <img src={avatar.url} alt={basicInfo?.fullName} className="w-24 h-32 object-cover border" />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-blue-900">{basicInfo?.fullName}</h1>
          <div className="mt-2 space-y-1 text-slate-600">
            <p><strong>Applied Position:</strong> {basicInfo?.position}</p>
            <p><strong>Address:</strong> {address?.streetName}, {address?.city}, {address?.district}, {address?.pincode}, {address?.country}</p>
            <p><strong>Telephone:</strong> {contactInfo?.primaryMobile}</p>
            <p><strong>Email:</strong> {contactInfo?.primaryEmail}</p>
          </div>
        </div>
      </div>

      {/* Experience */}
      {companies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase font-bold text-blue-900 border-b border-slate-300 pb-1 mb-3">Work Experience</h2>
          {companies.map((c, i) => (
            <div key={i} className="mb-3 flex gap-4">
              <div className="w-1/4 font-semibold text-slate-500">
                {formatDate(c.startDate)} – {c.isPresentJob ? 'Current' : formatDate(c.endDate)}
              </div>
              <div className="w-3/4">
                <div className="font-bold text-slate-900">{c.jobTitle}</div>
                <div className="text-slate-600">{c.jobLocation}</div>
                <ul className="list-disc list-inside mt-1">
                  {c.responsibility?.map((r, ri) => <li key={ri}>{r}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {languageProficiency?.languageKnows && (
        <div>
          <h2 className="text-xs uppercase font-bold text-blue-900 border-b border-slate-300 pb-1 mb-2">Language Competence</h2>
          <div className="space-y-1">
            {languageProficiency.languageKnows.map((l, i) => (
              <div key={i} className="flex gap-4">
                <span className="w-1/4 font-semibold text-slate-700">{l.languageName}</span>
                <span className="w-3/4 text-slate-600">Proficiency Level: {l.proficiencyOutOfTen}/10</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}