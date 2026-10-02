import React from 'react';

const palettes = {
  clean: { ink: '#17231e', muted: '#66736d', accent: '#1d8a62', line: '#dce4df', soft: '#f4f7f5' },
  executive: { ink: '#1c2430', muted: '#6b7280', accent: '#243b53', line: '#dfe3e8', soft: '#f6f7f9' },
  tech: { ink: '#111827', muted: '#64748b', accent: '#2563eb', line: '#dbe3ef', soft: '#f4f7fb' },
  academic: { ink: '#1f2937', muted: '#6b7280', accent: '#4338ca', line: '#e0e0eb', soft: '#f6f6fb' },
  creative: { ink: '#202124', muted: '#6b7280', accent: '#d97706', line: '#e7e2da', soft: '#fbf8f2' },
  split: { ink: '#18212b', muted: '#64748b', accent: '#7c3aed', line: '#e5e0ee', soft: '#f7f5fa' },
  startup: { ink: '#15251e', muted: '#66776e', accent: '#e11d48', line: '#eadde2', soft: '#fff7f9' },
  consultant: { ink: '#172033', muted: '#64748b', accent: '#0f6aa6', line: '#dce5ec', soft: '#f5f8fa' },
  graduate: { ink: '#19302a', muted: '#687870', accent: '#0f9f75', line: '#dce9e3', soft: '#f4faf7' },
  international: { ink: '#1e293b', muted: '#64748b', accent: '#0284c7', line: '#dce7ef', soft: '#f3f8fb' },
};

const map = {
  'clean-ats-optimizer': 'clean',
  'executive-minimalist': 'executive',
  'tech-modernist': 'tech',
  'academic-researcher': 'academic',
  'creative-professional': 'creative',
  'two-column-split': 'split',
  'startup-innovator': 'startup',
  'consultant-strategist': 'consultant',
  'entry-level-graduate': 'graduate',
  'international-europass': 'international',
};

export default function TemplatePreview({ templateId = 'clean-ats-optimizer', className = '' }) {
  const p = palettes[map[templateId]] || palettes.clean;
  const split = templateId === 'two-column-split' || templateId === 'international-europass';
  const darkRail = templateId === 'startup-innovator';
  const accentHeader = ['creative-professional', 'tech-modernist'].includes(templateId);
  const academic = templateId === 'academic-researcher';

  return (
    <div
      className={`template-preview ${className}`}
      style={{ '--tp-ink': p.ink, '--tp-muted': p.muted, '--tp-accent': p.accent, '--tp-line': p.line, '--tp-soft': p.soft }}
    >
      {split && (
        <aside className="tp-rail">
          <div className="tp-avatar">AM</div>
          <div className="tp-rail-name">Aarav<br />Mehta</div>
          <div className="tp-rail-title">Backend Engineer</div>
          <div className="tp-rail-block"><b>CONTACT</b><i /><i /><i /></div>
          <div className="tp-rail-block"><b>SKILLS</b><i /><i /><i /><i /></div>
        </aside>
      )}
      <div className="tp-main">
        {!split && (
          <div className={`tp-header ${accentHeader ? 'tp-header--accent' : ''} ${darkRail ? 'tp-header--dark' : ''}`}>
            <div><div className="tp-name">Aarav Mehta</div><div className="tp-role">Backend Engineer</div></div>
            <div className="tp-contact">Pune, India<br />aarav.mehta@example.com<br />+91 98765 43210</div>
          </div>
        )}
        {split ? <div className="tp-split-heading"><div className="tp-name">Aarav Mehta</div><div className="tp-role">Backend Engineer</div></div> : null}
        <section className="tp-section"><h4>PROFILE</h4><div className="tp-rule" /><p>Backend engineer focused on reliable APIs, distributed systems and pragmatic developer experiences.</p></section>
        <section className="tp-section">
          <h4>{academic ? 'RESEARCH & EXPERIENCE' : 'EXPERIENCE'}</h4><div className="tp-rule" />
          <div className="tp-job"><div className="tp-job-top"><b>Backend Engineer</b><span>2023 — Present</span></div><strong>Northstar Technologies</strong><p>Designed resilient APIs and improved background processing reliability across customer workflows.</p><ul><li>Shipped production services used by multiple product teams.</li><li>Reduced processing failures through queues and observability.</li></ul></div>
          <div className="tp-job"><div className="tp-job-top"><b>Software Engineer</b><span>2021 — 2023</span></div><strong>Vertex Labs</strong><p>Built internal platforms and reusable TypeScript services for a growing product team.</p></div>
        </section>
        <div className="tp-cols">
          <section className="tp-section"><h4>EDUCATION</h4><div className="tp-rule" /><b>B.Tech, Computer Science</b><p>Northstar Institute · 2022</p></section>
          <section className="tp-section"><h4>SKILLS</h4><div className="tp-rule" /><p>TypeScript · Node.js · PostgreSQL · Redis · AWS · Docker</p></section>
        </div>
        {academic && <section className="tp-section"><h4>PUBLICATIONS</h4><div className="tp-rule" /><p>Distributed Systems Patterns for Modern Web Applications · 2025</p></section>}
      </div>
    </div>
  );
}
