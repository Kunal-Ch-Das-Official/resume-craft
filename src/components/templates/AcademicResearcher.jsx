// components/templates/AcademicResearcher.jsx
import React from 'react';
import { toArray, sortByPriority, formatDate } from '../../components/utils/resumeHelpers.js';

export default function AcademicResearcher({ data }) {
  const {
    basicInfo,
    address,
    contactInfo,
    educations,
    publications,
    workExperience,
    certifications,
    languageProficiency,
  } = data;

  const qualifications = sortByPriority(toArray(educations?.qualifications));
  const publicationList = sortByPriority(toArray(publications?.publications));
  const companies = sortByPriority(toArray(workExperience?.companies));
  const certs = sortByPriority(toArray(certifications?.certificates));

  return (
    <div className="max-w-4xl mx-auto p-12 bg-white text-black font-serif text-sm leading-relaxed">
      <div className="text-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold tracking-normal uppercase">{basicInfo?.fullName}</h1>
        <p className="text-sm italic text-gray-700">{basicInfo?.position}</p>
        <p className="text-xs text-gray-600 mt-1">
          {address?.city}, {address?.district}, {address?.country} | Email: {contactInfo?.primaryEmail} | Phone: {contactInfo?.primaryMobile}
        </p>
      </div>

      {/* Higher Education */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1 mb-3">
          {educations?.sectionTitle || 'Higher Education'}
        </h2>
        {qualifications.map((q, i) => (
          <div key={i} className="mb-3 flex justify-between">
            <div>
              <div className="font-bold">{q.institutionName}</div>
              <div className="text-xs text-gray-700">{q.description}</div>
              {q.percentage && <div className="text-xs italic">Marks / Grade: {q.percentage}</div>}
            </div>
            <span className="text-xs">{formatDate(q.startedAt)} – {q.pursuing ? 'Candidate' : formatDate(q.yearOfComplete)}</span>
          </div>
        ))}
      </div>

      {/* Publications */}
      {publicationList.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1 mb-3">
            {publications?.sectionTitle || 'Publications & Research'}
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-xs">
            {publicationList.map((pub, i) => (
              <li key={i}>
                <span>{pub.description}</span>
                {pub.referenceUrl && (
                  <a href={pub.referenceUrl} className="underline ml-1">[Source]</a>
                )}
                {pub.publicationReference?.map((ref, ri) => (
                  <span key={ri} className="italic ml-1">— <a href={ref.accessUrl?.url} className="underline">{ref.title}</a></span>
                ))}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Academic Appointments & Experience */}
      {companies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1 mb-3">
            {workExperience?.sectionTitle || 'Appointments & Experience'}
          </h2>
          {companies.map((c, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between font-bold text-xs">
                <span>{c.jobTitle} — {c.jobLocation}</span>
                <span>{formatDate(c.startDate)} – {c.isPresentJob ? 'Present' : formatDate(c.endDate)}</span>
              </div>
              {c.responsibility?.map((r, ri) => (
                <p key={ri} className="text-xs text-gray-800 ml-4">• {r}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {languageProficiency?.languageKnows && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">Languages</h2>
          <p className="text-xs">
            {languageProficiency.languageKnows.map(l => `${l.languageName} (${l.proficiencyOutOfTen}/10)`).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}