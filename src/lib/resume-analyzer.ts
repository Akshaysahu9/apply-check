import { ALL_SKILLS, SKILL_ALIASES, SKILL_CATEGORIES, ROLE_PROFILES } from "./skills";
import {
  extractCertifications,
  extractContact,
  extractProjects,
  type ContactInfo,
} from "./contact-parser";

export interface SectionCheck {
  name: string;
  found: boolean;
  tip: string;
}

export interface RoleFit {
  role: string;
  matchPercent: number;
  matchedSkills: string[];
}

export interface KeywordStat {
  word: string;
  count: number;
}

export interface ResumeAnalysis {
  overallScore: number;
  atsScore: number;
  contentScore: number;
  structureScore: number;
  impactScore: number;
  skills: string[];
  skillsByCategory: Record<string, string[]>;
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  experienceYears: number | null;
  detectedRole: string | null;
  education: string[];
  contact: ContactInfo;
  certifications: string[];
  projects: string[];
  pageAdvice: string;
  keywordDensity: KeywordStat[];
  bulletCount: number;
  readability: "Good" | "Average" | "Needs work";
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedIn: boolean;
  hasGitHub: boolean;
  wordCount: number;
  sections: string[];
  sectionChecklist: SectionCheck[];
  actionVerbs: string[];
  metricsCount: number;
  roleFit: RoleFit[];
  grade: string;
}

const ACTION_VERBS = [
  "developed", "built", "designed", "implemented", "led", "managed", "created",
  "optimized", "reduced", "increased", "achieved", "delivered", "automated",
  "deployed", "architected", "improved", "launched", "mentored", "collaborated",
  "analyzed", "resolved", "streamlined", "scaled", "integrated",
];

const EDUCATION_PATTERNS = [
  /\b(b\.?\s*tech|b\.?\s*e\.?|bachelor\s+of\s+technology|bachelor\s+of\s+engineering)\b/i,
  /\b(m\.?\s*tech|m\.?\s*e\.?|master\s+of\s+technology|master\s+of\s+engineering)\b/i,
  /\b(mca|m\.?\s*c\.?\s*a\.?|master\s+of\s+computer)\b/i,
  /\b(bca|b\.?\s*c\.?\s*a\.?)\b/i,
  /\b(mba|b\.?\s*com|b\.?\s*sc|m\.?\s*sc|ph\.?\s*d)\b/i,
  /\b(12th|10th|intermediate|hsc|ssc|cbse|icse)\b/i,
];

const ROLE_PATTERNS = [
  { pattern: /full[\s-]?stack/i, role: "Full Stack Developer" },
  { pattern: /front[\s-]?end|frontend/i, role: "Frontend Developer" },
  { pattern: /back[\s-]?end|backend/i, role: "Backend Developer" },
  { pattern: /devops|sre|site reliability/i, role: "DevOps Engineer" },
  { pattern: /data\s*(scientist|analyst|engineer)/i, role: "Data Scientist" },
  { pattern: /machine\s*learning|ml\s*engineer/i, role: "ML Engineer" },
  { pattern: /software\s*(developer|engineer)|sde/i, role: "Software Engineer" },
  { pattern: /mobile|android|ios|react\s*native/i, role: "Mobile Developer" },
  { pattern: /cloud\s*engineer/i, role: "Cloud Engineer" },
  { pattern: /python\s*developer/i, role: "Python Developer" },
];

function normalizeText(text: string) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function skillInText(normalized: string, skill: string): boolean {
  const base = escapeRegex(skill).replace(/\\\./g, "\\.?");
  if (new RegExp(`\\b${base}\\b`, "i").test(normalized)) return true;

  const aliases = SKILL_ALIASES[skill] || [];
  return aliases.some((alias) => new RegExp(`\\b${escapeRegex(alias)}\\b`, "i").test(normalized));
}

function extractSkills(text: string): string[] {
  const normalized = normalizeText(text);
  const found = new Set<string>();

  for (const skill of ALL_SKILLS) {
    if (skillInText(normalized, skill)) {
      found.add(formatSkill(skill));
    }
  }

  return Array.from(found).sort();
}

function formatSkill(skill: string) {
  const special: Record<string, string> = {
    "c++": "C++",
    "c#": "C#",
    "node.js": "Node.js",
    "next.js": "Next.js",
    ".net": ".NET",
    "ci/cd": "CI/CD",
    aws: "AWS",
    gcp: "GCP",
    sql: "SQL",
    api: "API",
    nlp: "NLP",
    etl: "ETL",
  };
  const lower = skill.toLowerCase();
  if (special[lower]) return special[lower];
  return skill.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function categorizeSkills(skills: string[]) {
  const result: Record<string, string[]> = {};
  const normalizedSkills = skills.map((s) => s.toLowerCase());

  for (const [category, categorySkills] of Object.entries(SKILL_CATEGORIES)) {
    const matched = skills.filter((skill, i) =>
      categorySkills.some((cs) => {
        const nrs = normalizedSkills[i];
        return nrs.includes(cs) || cs.includes(nrs) || nrs.replace(/\s/g, "").includes(cs.replace(/\s/g, ""));
      })
    );
    if (matched.length > 0) result[category] = matched;
  }

  return result;
}

function detectSections(text: string): string[] {
  const patterns = [
    "experience", "education", "skills", "projects", "certifications",
    "summary", "objective", "achievements", "work history", "technical skills",
    "internship", "publications", "awards",
  ];
  const normalized = normalizeText(text);
  return patterns.filter((s) => normalized.includes(s));
}

function buildSectionChecklist(text: string): SectionCheck[] {
  const normalized = normalizeText(text);
  const checks: SectionCheck[] = [
    { name: "Contact Info", found: /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i.test(text), tip: "Add email, phone, and LinkedIn at the top" },
    { name: "Professional Summary", found: /summary|objective|profile|about me/i.test(normalized), tip: "Add a 2–3 line summary highlighting your expertise" },
    { name: "Work Experience", found: /experience|employment|work history/i.test(normalized), tip: "List roles with company, dates, and bullet achievements" },
    { name: "Education", found: /education|degree|university|college|b\.?tech|b\.?e/i.test(normalized), tip: "Include degree, institution, and graduation year" },
    { name: "Skills Section", found: /skills|technical|technologies|competencies/i.test(normalized), tip: "Group skills by category (Languages, Tools, Frameworks)" },
    { name: "Projects", found: /projects?|portfolio/i.test(normalized), tip: "Add 2–3 projects with tech stack and outcomes" },
    { name: "Quantified Results", found: /\d+%|\d+x|₹\s*\d|rs\.?\s*\d|\$\d/i.test(text), tip: "Use numbers: 'Reduced load time by 40%' or 'Handled 10K users'" },
    { name: "Action Verbs", found: new RegExp(`\\b(${ACTION_VERBS.slice(0, 8).join("|")})\\b`, "i").test(text), tip: "Start bullets with verbs: Developed, Led, Built, Optimized" },
  ];
  return checks;
}

function extractEducation(text: string): string[] {
  const found: string[] = [];
  for (const pattern of EDUCATION_PATTERNS) {
    const match = text.match(pattern);
    if (match) found.push(match[0].toUpperCase().replace(/\s+/g, " "));
  }
  return [...new Set(found)];
}

function detectRole(text: string): string | null {
  const head = text.slice(0, 800);
  for (const { pattern, role } of ROLE_PATTERNS) {
    if (pattern.test(head)) return role;
  }
  return null;
}

function estimateExperienceYears(text: string): number | null {
  const explicit = text.match(/(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/i);
  if (explicit) {
    const yrs = parseFloat(explicit[1]);
    if (yrs > 0 && yrs < 45) return Math.round(yrs);
  }

  const ranges = [...text.matchAll(/(?:20\d{2})\s*[-–—to]+\s*(?:20\d{2}|present|current)/gi)];
  if (ranges.length > 0) {
    let totalMonths = 0;
    for (const range of ranges) {
      const years = range[0].match(/20\d{2}/g);
      if (years && years.length >= 1) {
        const start = parseInt(years[0]);
        const end = /present|current/i.test(range[0]) ? new Date().getFullYear() : parseInt(years[years.length - 1]);
        totalMonths += Math.max(0, (end - start) * 12);
      }
    }
    if (totalMonths > 0) return Math.round(totalMonths / 12);
  }

  const yearMatches = text.match(/\b(20\d{2})\b/g);
  if (yearMatches && yearMatches.length >= 2) {
    const years = yearMatches.map(Number).sort((a, b) => a - b);
    const diff = Math.max(...years, new Date().getFullYear()) - years[0];
    if (diff > 0 && diff < 40) return diff;
  }

  return null;
}

function extractActionVerbs(text: string): string[] {
  const normalized = normalizeText(text);
  return ACTION_VERBS.filter((v) => new RegExp(`\\b${v}\\b`, "i").test(normalized));
}

function countMetrics(text: string): number {
  const matches = text.match(/\d+%|\d+x|₹\s*[\d,]+|rs\.?\s*[\d,]+|\$\s*[\d,]+|\d+\+?\s*(?:users|customers|clients|requests|transactions)/gi);
  return matches?.length || 0;
}

function computeRoleFit(skills: string[]): RoleFit[] {
  const normalized = skills.map((s) => s.toLowerCase());

  return ROLE_PROFILES.map((profile) => {
    const matched = profile.skills.filter((req) =>
      normalized.some((s) => s.includes(req) || req.includes(s))
    );
    const matchPercent = Math.round((matched.length / profile.skills.length) * 100);
    return {
      role: profile.role,
      matchPercent,
      matchedSkills: matched.map(formatSkill),
    };
  })
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 4);
}

function scoreAts(text: string, skills: string[], checklist: SectionCheck[]): number {
  let score = 25;
  if (/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i.test(text)) score += 12;
  if (/\+?\d[\d\s\-().]{8,}\d/.test(text)) score += 10;
  if (/linkedin\.com/i.test(text)) score += 8;
  if (/github\.com/i.test(text)) score += 5;
  score += Math.min(20, skills.length * 2);
  score += checklist.filter((c) => c.found).length * 4;
  return Math.min(100, score);
}

function scoreContent(text: string, skills: string[], verbs: string[], metrics: number): number {
  let score = 20;
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount >= 250) score += 8;
  if (wordCount >= 450) score += 8;
  if (wordCount >= 650) score += 5;
  if (skills.length >= 6) score += 12;
  if (skills.length >= 12) score += 8;
  if (verbs.length >= 4) score += 12;
  if (verbs.length >= 8) score += 8;
  if (metrics >= 2) score += 10;
  if (metrics >= 5) score += 9;

  return Math.min(100, score);
}

function scoreStructure(text: string, sections: string[]): number {
  let score = 20;
  score += Math.min(40, sections.length * 7);
  if (sections.some((s) => /experience|work/.test(s))) score += 12;
  if (sections.some((s) => /education/.test(s))) score += 8;
  if (sections.some((s) => /skills/.test(s))) score += 8;

  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.some((l) => /^[\s]*[-•*▪]/.test(l))) score += 12;

  return Math.min(100, score);
}

function scoreImpact(metrics: number, verbs: string[]): number {
  let score = 30;
  score += Math.min(35, metrics * 7);
  score += Math.min(35, verbs.length * 4);
  return Math.min(100, score);
}

function countBullets(text: string): number {
  return text.split("\n").filter((l) => /^[\s]*[-•*▪]/.test(l)).length;
}

function getPageAdvice(wordCount: number): string {
  if (wordCount < 250) return "Too short — add more detail on projects and experience.";
  if (wordCount <= 600) return "Good length for a 1-page resume.";
  if (wordCount <= 1000) return "Fine for 1–2 pages. Cut fluff if applying for fresher roles.";
  return "Quite long — recruiters skim. Try trimming to under 900 words.";
}

function getReadability(text: string, bulletCount: number): "Good" | "Average" | "Needs work" {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  const avgLen = sentences.length
    ? sentences.reduce((a, s) => a + s.split(/\s+/).length, 0) / sentences.length
    : 30;

  if (bulletCount >= 8 && avgLen < 28) return "Good";
  if (bulletCount >= 4 || avgLen < 35) return "Average";
  return "Needs work";
}

function getKeywordDensity(text: string, skills: string[]): KeywordStat[] {
  const normalized = normalizeText(text);
  const counts: Record<string, number> = {};

  for (const skill of skills) {
    const key = skill.toLowerCase();
    const pattern = new RegExp(`\\b${escapeRegex(key).replace(/\\\./g, "\\.?")}\\b`, "gi");
    const matches = normalized.match(pattern);
    if (matches) counts[skill] = matches.length;
  }

  const techWords = ["api", "database", "frontend", "backend", "deployment", "testing"];
  for (const w of techWords) {
    const matches = normalized.match(new RegExp(`\\b${w}\\b`, "gi"));
    if (matches) counts[w] = (counts[w] || 0) + matches.length;
  }

  return Object.entries(counts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  return "Needs Work";
}

function generateInsights(
  text: string,
  skills: string[],
  checklist: SectionCheck[],
  atsScore: number,
  metrics: number,
  verbs: string[],
  roleFit: RoleFit[]
): { strengths: string[]; improvements: string[]; missingKeywords: string[] } {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const missingKeywords: string[] = [];
  const normalized = normalizeText(text);

  const checklistPassed = checklist.filter((c) => c.found).length;
  if (checklistPassed >= 6) strengths.push(`${checklistPassed}/8 usual sections found — structure looks fine`);
  if (skills.length >= 12) strengths.push(`${skills.length} tech skills picked up from the text`);
  else if (skills.length >= 6) strengths.push(`${skills.length} skills detected — decent coverage`);

  if (verbs.length >= 6) strengths.push(`${verbs.length} action verbs used (developed, built, led, etc.)`);
  if (metrics >= 3) strengths.push(`${metrics} places with numbers — reads better than plain bullets`);
  if (/github\.com/i.test(text)) strengths.push("GitHub link present");
  if (roleFit[0]?.matchPercent >= 70) strengths.push(`Closest role from skills: ${roleFit[0].role} (~${roleFit[0].matchPercent}% overlap)`);

  for (const check of checklist.filter((c) => !c.found)) {
    improvements.push(check.tip);
  }

  if (atsScore < 65) improvements.push("Use standard section headers: Experience, Education, Skills, Projects");
  if (metrics < 2) improvements.push("Add 3–5 numbers: percentages, team sizes, performance gains, revenue impact");
  if (verbs.length < 4) improvements.push("Start bullet points with strong verbs: Developed, Led, Optimized, Delivered");

  const topRole = roleFit[0];
  if (topRole) {
    const profile = ROLE_PROFILES.find((p) => p.role === topRole.role);
    if (profile) {
      for (const req of profile.skills) {
        if (!skillInText(normalized, req) && !skills.some((s) => s.toLowerCase().includes(req))) {
          missingKeywords.push(formatSkill(req));
        }
      }
    }
  }

  const universal = ["git", "agile", "problem solving", "communication", "rest api"];
  for (const kw of universal) {
    if (!skillInText(normalized, kw) && !missingKeywords.some((m) => m.toLowerCase().includes(kw))) {
      missingKeywords.push(formatSkill(kw));
    }
  }

  if (strengths.length === 0) strengths.push("Resume parsed fine — check improvements below");

  return {
    strengths: [...new Set(strengths)].slice(0, 5),
    improvements: [...new Set(improvements)].slice(0, 6),
    missingKeywords: [...new Set(missingKeywords)].slice(0, 8),
  };
}

export function analyzeResumeText(text: string): ResumeAnalysis {
  const skills = extractSkills(text);
  const skillsByCategory = categorizeSkills(skills);
  const sections = detectSections(text);
  const sectionChecklist = buildSectionChecklist(text);
  const actionVerbs = extractActionVerbs(text);
  const metricsCount = countMetrics(text);
  const roleFit = computeRoleFit(skills);
  const contact = extractContact(text);
  const certifications = extractCertifications(text);
  const projects = extractProjects(text);
  const bulletCount = countBullets(text);
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  const atsScore = scoreAts(text, skills, sectionChecklist);
  const contentScore = scoreContent(text, skills, actionVerbs, metricsCount);
  const structureScore = scoreStructure(text, sections);
  const impactScore = scoreImpact(metricsCount, actionVerbs);
  const overallScore = Math.round(atsScore * 0.3 + contentScore * 0.3 + structureScore * 0.2 + impactScore * 0.2);

  const { strengths, improvements, missingKeywords } = generateInsights(
    text, skills, sectionChecklist, atsScore, metricsCount, actionVerbs, roleFit
  );

  if (certifications.length > 0) {
    strengths.unshift(`${certifications.length} certification(s) listed — good for ATS`);
  }
  if (projects.length >= 2) {
    strengths.unshift(`${projects.length} projects found — helps back up your skills`);
  }

  return {
    overallScore,
    atsScore,
    contentScore,
    structureScore,
    impactScore,
    skills,
    skillsByCategory,
    missingKeywords,
    strengths: [...new Set(strengths)].slice(0, 6),
    improvements,
    experienceYears: estimateExperienceYears(text),
    detectedRole: detectRole(text),
    education: extractEducation(text),
    contact,
    certifications,
    projects,
    pageAdvice: getPageAdvice(wordCount),
    keywordDensity: getKeywordDensity(text, skills),
    bulletCount,
    readability: getReadability(text, bulletCount),
    hasEmail: !!contact.email,
    hasPhone: !!contact.phone,
    hasLinkedIn: !!contact.linkedIn,
    hasGitHub: !!contact.github,
    wordCount,
    sections,
    sectionChecklist,
    actionVerbs: actionVerbs.slice(0, 10),
    metricsCount,
    roleFit,
    grade: getGrade(overallScore),
  };
}
