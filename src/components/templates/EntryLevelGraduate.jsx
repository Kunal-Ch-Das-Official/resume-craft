// components/templates/EntryLevelGraduate.jsx
import React from 'react';
import { toArray, sortByPriority, formatDate } from '../../components/utils/resumeHelpers.js';

export default function EntryLevelGraduate({ data }) {
  const { basicInfo, address, contactInfo, educations, projects, skills, certifications } = data;
  const qualifications = sortByPriority(toArray(educations?.qualifications));
  const projectList = sortByPriority(toArray(projects?.projects));
  const certs = sortByPriority(toArray(certifications?.certificates));
  const skillMap = skills?.skills || {};

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white font-sans text-neutral-800">
      <div className="text-center pb-4 border-b border-neutral-300 mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">{basicInfo?.fullName}</h1>
        <p className="text-sm text-neutral-600 mt-1">{basicInfo?.position}</p>
        <p className="text-xs text-neutral-500 mt-1">{contactInfo?.primaryEmail} | {contactInfo?.primaryMobile} | {address?.city}, {address?.country}</p>
      </div>

      {/* Education First */}
      {qualifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase font-bold tracking-wider text-neutral-500 border-b pb-1 mb-3">Education & Qualifications</h2>
          {qualifications.map((q, i) => (
            <div key={i} className="mb-2 text-xs">
              <div className="flex justify-between font-bold">
                <span>{q.institutionName}</span>
                <span>{formatDate(q.startedAt)} – {q.pursuing ? 'Pursuing' : formatDate(q.yearOfComplete)}</span>
              </div>
              <p className="text-neutral-600">{q.description}</p>
              {q.percentage && <p className="text-neutral-500 italic">Score/GPA: {q.percentage}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Academic Projects */}
      {projectList.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase font-bold tracking-wider text-neutral-500 border-b pb-1 mb-3">Academic & Personal Projects</h2>
          {projectList.map((p, i) => (
            <div key={i} className="mb-3 text-xs">
              <div className="flex justify-between font-bold">
                <span>Project #{i + 1}</span>
                {p.projectUrl && <a href={p.projectUrl} className="underline text-blue-600">Link</a>}
              </div>
              <p className="text-neutral-600">{p.description}</p>
              <p className="text-neutral-500 mt-0.5"><strong>Skills:</strong> {p.skills?.join(', ')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certs.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase font-bold tracking-wider text-neutral-500 border-b pb-1 mb-2">Certificates</h2>
          {certs.map((c, i) => (
            <p key={i} className="text-xs text-neutral-700">• {c.certificateContent?.title || 'Certificate'} ({c.duration})</p>
          ))}
        </div>
      )}
    </div>
  );
}