import type { ResumeAnalysis } from "./resume-analyzer";

export interface JobMatchResult {
  jobId: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  skillMatch: number;
  experienceMatch: number;
  resumeQuality: number;
  matchedSkills: string[];
  missingSkills: string[];
  bonusSkills: string[];
  salary: string;
  type: string;
  posted: string;
  experience: string;
  recommendation: string;
  applyPriority: "High" | "Medium" | "Low";
}

function normalizeSkill(skill: string) {
  return skill.toLowerCase().replace(/[.\s]/g, "").trim();
}

function skillMatch(resumeSkills: string[], target: string): string | null {
  const normTarget = normalizeSkill(target);
  for (const rs of resumeSkills) {
    const normRs = normalizeSkill(rs);
    if (normRs.includes(normTarget) || normTarget.includes(normRs)) return rs;
  }
  return null;
}

function matchSkillList(resumeSkills: string[], required: readonly string[]) {
  const matched: string[] = [];
  const missing: string[] = [];

  for (const req of required) {
    const found = skillMatch(resumeSkills, req);
    if (found) matched.push(found);
    else missing.push(req.charAt(0).toUpperCase() + req.slice(1));
  }

  return { matched, missing };
}

function parseExperienceRange(exp: string): { min: number; max: number } {
  const plus = exp.match(/(\d+)\+/);
  if (plus) return { min: parseInt(plus[1]), max: 20 };

  const range = exp.match(/(\d+)[–-](\d+)/);
  if (range) return { min: parseInt(range[1]), max: parseInt(range[2]) };

  const single = exp.match(/(\d+)/);
  if (single) return { min: parseInt(single[1]), max: parseInt(single[1]) + 2 };

  return { min: 0, max: 10 };
}

function experienceFit(candidateYears: number | null, jobExp: string): number {
  if (!candidateYears) return 50;
  const { min, max } = parseExperienceRange(jobExp);

  if (candidateYears >= min && candidateYears <= max + 2) return 100;
  if (candidateYears >= min - 1 && candidateYears <= max + 3) return 80;
  if (candidateYears < min) return Math.max(30, 70 - (min - candidateYears) * 15);
  return Math.max(40, 85 - (candidateYears - max) * 10);
}

function getRecommendation(score: number, missingCount: number): { text: string; priority: "High" | "Medium" | "Low" } {
  if (score >= 85) return { text: "Skills line up well. Worth applying if the role fits you.", priority: "High" };
  if (score >= 72) return { text: "Good overlap. Mention the matched skills clearly in your application.", priority: "High" };
  if (score >= 58) return { text: "Partial match. Fix the missing skills or add a project that covers them.", priority: "Medium" };
  if (missingCount <= 2) return { text: "Only a couple of gaps — you could still try if you have related experience.", priority: "Medium" };
  return { text: "Low overlap right now. Either upskill or look at roles closer to your stack.", priority: "Low" };
}

export function matchResumeToJob(
  analysis: ResumeAnalysis,
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    posted: string;
    experience: string;
    requiredSkills: readonly string[];
    preferredSkills?: readonly string[];
  }
): JobMatchResult {
  const required = matchSkillList(analysis.skills, job.requiredSkills);
  const preferred = job.preferredSkills ? matchSkillList(analysis.skills, job.preferredSkills) : { matched: [], missing: [] };

  const requiredScore = (required.matched.length / job.requiredSkills.length) * 100;
  const preferredScore = job.preferredSkills?.length
    ? (preferred.matched.length / job.preferredSkills.length) * 100
    : 0;

  const skillMatchScore = Math.round(requiredScore * 0.75 + preferredScore * 0.25);
  const experienceMatchScore = Math.round(experienceFit(analysis.experienceYears, job.experience));
  const resumeQualityScore = analysis.overallScore;

  const matchScore = Math.min(
    100,
    Math.round(skillMatchScore * 0.55 + experienceMatchScore * 0.25 + resumeQualityScore * 0.2)
  );

  const { text, priority } = getRecommendation(matchScore, required.missing.length);

  return {
    jobId: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    matchScore,
    skillMatch: skillMatchScore,
    experienceMatch: experienceMatchScore,
    resumeQuality: resumeQualityScore,
    matchedSkills: [...new Set([...required.matched, ...preferred.matched])],
    missingSkills: required.missing,
    bonusSkills: preferred.matched,
    salary: job.salary,
    type: job.type,
    posted: job.posted,
    experience: job.experience,
    recommendation: text,
    applyPriority: priority,
  };
}

export function matchResumeToAllJobs(
  analysis: ResumeAnalysis,
  jobs: readonly {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    posted: string;
    experience: string;
    requiredSkills: readonly string[];
    preferredSkills?: readonly string[];
  }[]
): JobMatchResult[] {
  return jobs
    .map((job) => matchResumeToJob(analysis, job))
    .sort((a, b) => b.matchScore - a.matchScore);
}
