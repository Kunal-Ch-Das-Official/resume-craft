export const TEMPLATE_DEFINITIONS = [
  { id: 'clean-ats-optimizer', name: 'Clean ATS Optimizer', category: 'ATS / Corporate', description: 'Straightforward hierarchy designed for reliable parsing and recruiter scanning.', accent: 'emerald', bestFor: 'General applications' },
  { id: 'executive-minimalist', name: 'Executive Minimalist', category: 'Executive', description: 'Confident typography and restrained spacing for senior professionals.', accent: 'slate', bestFor: 'Leadership roles' },
  { id: 'tech-modernist', name: 'Tech Modernist', category: 'Technology', description: 'Modern developer-focused layout with strong technical sectioning.', accent: 'cyan', bestFor: 'Engineering & product' },
  { id: 'academic-researcher', name: 'Academic Researcher', category: 'Academic', description: 'Publication-friendly structure with emphasis on research and education.', accent: 'indigo', bestFor: 'Research & academia' },
  { id: 'creative-professional', name: 'Creative Professional', category: 'Creative', description: 'Expressive visual rhythm while keeping the content easy to navigate.', accent: 'amber', bestFor: 'Design & creative' },
  { id: 'two-column-split', name: 'Two Column Split', category: 'Modern', description: 'Balanced two-column composition for dense but readable resumes.', accent: 'violet', bestFor: 'Multi-skilled profiles' },
  { id: 'startup-innovator', name: 'Startup Innovator', category: 'Startup', description: 'Compact, energetic presentation built around impact and projects.', accent: 'rose', bestFor: 'Startups & builders' },
  { id: 'consultant-strategist', name: 'Consultant Strategist', category: 'Business', description: 'Polished consulting-style structure with crisp section hierarchy.', accent: 'blue', bestFor: 'Consulting & business' },
  { id: 'entry-level-graduate', name: 'Entry Level Graduate', category: 'Fresher', description: 'Education and projects take center stage for early-career candidates.', accent: 'teal', bestFor: 'Students & freshers' },
  { id: 'international-europass', name: 'International Europass', category: 'International', description: 'Detailed conventional format suitable for international applications.', accent: 'sky', bestFor: 'Global applications' },
];

export const EMPTY_RESUME = {
  basicInfo: { fullName: '', position: '' },
  address: { streetName: '', city: '', district: '', pincode: '', country: 'India' },
  contactInfo: { primaryEmail: '', secondaryEmail: '', primaryMobile: '', secondaryMobile: '', linkedin: '', github: '', portfolio: '' },
  profileSummary: { priority: 1, subject: '', objective: '' },
  educations: { priority: 4, sectionTitle: 'Education', qualifications: {} },
  workExperience: { priority: 3, sectionTitle: 'Experience', companies: {} },
  skills: { priority: 6, sectionTitle: 'Skills', skills: {} },
  languageProficiency: { priority: 10, sectionTitle: 'Languages', languageKnows: [] },
  projects: { priority: 3, sectionTitle: 'Projects', projects: {} },
  certifications: { priority: 5, sectionTitle: 'Certifications', certificates: {} },
  openSource: { priority: 7, sectionTitle: 'Open Source', contributions: {} },
  publications: { priority: 8, sectionTitle: 'Publications', publications: {} },
  awardsAndAchievements: { priority: 9, sectionTitle: 'Awards & Achievements', achievements: [] },
  templateName: 'clean-ats-optimizer',
};

export const DEMO_RESUME = {
  ...EMPTY_RESUME,
  basicInfo: { fullName: 'Aarav Mehta', position: 'Backend Engineer' },
  address: { streetName: '42 River Lane', city: 'Pune', district: 'Pune', pincode: '411001', country: 'India' },
  contactInfo: { primaryEmail: 'aarav.mehta@example.com', primaryMobile: '+91 98765 43210', linkedin: 'linkedin.com/in/aarav-mehta', github: 'github.com/aarav-mehta', portfolio: 'aaravmehta.dev' },
  profileSummary: { priority: 1, subject: 'Backend Engineer', objective: 'Backend engineer focused on reliable APIs, distributed systems, and pragmatic developer experiences. I enjoy turning complex workflows into maintainable products with measurable impact.' },
  educations: { priority: 4, sectionTitle: 'Education', qualifications: { btech: { priority: 1, institutionName: 'Northstar Institute of Technology', startedAt: '2018-08-01', yearOfComplete: '2022-06-01', pursuing: false, percentage: '8.7 CGPA', description: 'Computer Science & Engineering' } } },
  workExperience: { priority: 3, sectionTitle: 'Experience', companies: { northstar: { priority: 1, jobTitle: 'Backend Engineer', jobConditions: 'REMOTE', jobTypes: 'FULL_TIME', jobLocation: 'Pune, India', responsibility: ['Designed and shipped resilient REST APIs used by multiple product teams.', 'Improved background processing reliability with queues, caching, and observability.', 'Collaborated with frontend and product teams to deliver customer-facing workflows.'], startDate: '2023-04-01', isPresentJob: true } } },
  skills: { priority: 6, sectionTitle: 'Skills', skills: { Backend: ['TypeScript', 'Node.js', 'Express.js', 'REST APIs'], Data: ['PostgreSQL', 'MongoDB', 'Redis'], Platform: ['Docker', 'AWS', 'CI/CD'] } },
  languageProficiency: { priority: 10, sectionTitle: 'Languages', languageKnows: [{ languageName: 'English', proficiencyOutOfTen: 9 }, { languageName: 'Hindi', proficiencyOutOfTen: 8 }] },
  projects: { priority: 3, sectionTitle: 'Projects', projects: { 'resume-platform': { priority: 1, description: 'A production-oriented resume platform with reusable templates and structured profile data.', projectUrl: 'github.com/example/resume-platform', startDate: '2025-01-15', isWorking: true, techStack: ['Next.js', 'Node.js', 'MongoDB'], skills: ['Product design', 'API architecture'] } } },
  certifications: { priority: 5, sectionTitle: 'Certifications', certificates: { aws: { priority: 1, overview: 'AWS Certified Developer', skillLearned: ['AWS', 'Lambda', 'Cloud architecture'], duration: '2024' } } },
  openSource: { priority: 7, sectionTitle: 'Open Source', contributions: { subatom: { priority: 1, githubUrl: 'github.com/example/project', description: 'Contributed reusable framework tooling and developer documentation.', duration: '2025 – Present' } } },
  awardsAndAchievements: { priority: 9, sectionTitle: 'Awards & Achievements', achievements: [{ priority: 1, title: 'Hackathon Winner', description: 'Won first place at a national product hackathon.' }] },
  templateName: 'clean-ats-optimizer',
};

export function cloneResume(data = EMPTY_RESUME) {
  return JSON.parse(JSON.stringify(data));
}
