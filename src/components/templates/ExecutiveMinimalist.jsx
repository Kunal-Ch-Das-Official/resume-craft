// components/templates/ExecutiveMinimalist.jsx
import React from "react";
import { toArray, sortByPriority, formatDate } from '../../components/utils/resumeHelpers.js';

export default function ExecutiveMinimalist({ data }) {
  const {
    basicInfo,
    address,
    contactInfo,
    profileSummary,
    workExperience,
    projects,
    educations,
    certifications,
    skills,
    publications,
    awardsAndAchievements,
    openSource,
    languageProficiency,
  } = data;

  const companies = sortByPriority(toArray(workExperience?.companies));
  const projectList = sortByPriority(toArray(projects?.projects));
  const qualifications = sortByPriority(toArray(educations?.qualifications));
  const certificateList = sortByPriority(toArray(certifications?.certificates));
  const publicationList = sortByPriority(toArray(publications?.publications));
  const openSourceList = sortByPriority(toArray(openSource?.contributions));
  const skillMap = skills?.skills || {};

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white text-gray-900 font-serif leading-normal">
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-1">
          {basicInfo?.fullName}
        </h1>
        <p className="text-lg italic font-sans text-gray-700 mb-2">
          {basicInfo?.position}
        </p>
        <p className="text-xs font-sans text-gray-600 space-x-2">
          <span>
            {address?.streetName}, {address?.city}, {address?.district},{" "}
            {address?.country} - {address?.pincode}
          </span>
          <span>•</span>
          <span>{contactInfo?.primaryMobile}</span>
          <span>•</span>
          <span>{contactInfo?.primaryEmail}</span>
          {contactInfo?.linkedin && (
            <>
              <span>•</span>
              <a href={contactInfo.linkedin} className="underline text-black">
                LinkedIn
              </a>
            </>
          )}
        </p>
      </div>

      {/* Profile Summary */}
      {profileSummary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2 font-sans">
            {profileSummary.subject || "Executive Profile"}
          </h2>
          <p className="text-sm text-gray-800 text-justify">
            {profileSummary.objective}
          </p>
        </div>
      )}

      {/* Experience */}
      {companies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3 font-sans">
            {workExperience?.sectionTitle || "Professional Experience"}
          </h2>
          {companies.map((c, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-base">{c.jobTitle}</span>
                <span className="text-xs font-sans text-gray-600">
                  {formatDate(c.startDate)} –{" "}
                  {c.isPresentJob ? "Present" : formatDate(c.endDate)}
                </span>
              </div>
              <div className="text-xs font-sans text-gray-600 mb-1">
                {c.jobLocation && <span>{c.jobLocation} | </span>}
                <span>
                  {c.jobTypes} ({c.jobConditions})
                </span>
              </div>
              {c.responsibility && c.responsibility.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                  {c.responsibility.map((r, ri) => (
                    <li key={ri}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {qualifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3 font-sans">
            {educations?.sectionTitle || "Education"}
          </h2>
          {qualifications.map((q, i) => (
            <div key={i} className="mb-2 flex justify-between items-baseline">
              <div>
                <div className="font-bold text-sm">{q.institutionName}</div>
                {q.description && (
                  <div className="text-xs text-gray-700">{q.description}</div>
                )}
                {q.percentage && (
                  <div className="text-xs text-gray-600">
                    Grade / Percentage: {q.percentage}
                  </div>
                )}
              </div>
              <span className="text-xs font-sans text-gray-600">
                {formatDate(q.startedAt)} –{" "}
                {q.pursuing ? "Pursuing" : formatDate(q.yearOfComplete)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {Object.keys(skillMap).length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2 font-sans">
            {skills?.sectionTitle || "Core Competencies"}
          </h2>
          <div className="space-y-1 text-sm font-sans">
            {Object.entries(skillMap).map(([category, list], i) => (
              <div key={i}>
                <strong className="font-serif">{category}: </strong>
                <span className="text-gray-700">
                  {Array.isArray(list) ? list.join(", ") : list}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      {(certificateList.length > 0 ||
        (awardsAndAchievements?.achievements &&
          awardsAndAchievements.achievements.length > 0)) && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2 font-sans">
            Certifications & Honors
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
            {certificateList.map((c, i) => (
              <li key={`c-${i}`}>
                <strong>{c.certificateContent?.title || "Certificate"}</strong>{" "}
                ({c.duration}) – Skills: {c.skillLearned?.join(", ")}
              </li>
            ))}
            {awardsAndAchievements?.achievements?.map((a, i) => (
              <li key={`a-${i}`}>
                <strong>{a.title}</strong>: {a.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {languageProficiency?.languageKnows &&
        languageProficiency.languageKnows.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2 font-sans">
              {languageProficiency.sectionTitle || "Languages"}
            </h2>
            <div className="text-sm flex space-x-6">
              {languageProficiency.languageKnows.map((lang, i) => (
                <span key={i}>
                  <strong>{lang.languageName}</strong> (
                  {lang.proficiencyOutOfTen}/10)
                </span>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
