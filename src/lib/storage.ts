import type { ResumeAnalysis } from "./resume-analyzer";

export interface AnalysisRecord {
  id: string;
  fileName: string;
  score: number;
  grade: string;
  skillsCount: number;
  analyzedAt: string;
  analysis: ResumeAnalysis;
}

const HISTORY_KEY = "applycheck_history";
const LAST_KEY = "lastAnalysis";
const RESUME_KEY = "lastResumeText";

export function saveAnalysis(fileName: string, analysis: ResumeAnalysis, resumeText: string) {
  if (typeof window === "undefined") return;

  const record: AnalysisRecord = {
    id: Date.now().toString(),
    fileName,
    score: analysis.overallScore,
    grade: analysis.grade,
    skillsCount: analysis.skills.length,
    analyzedAt: new Date().toISOString(),
    analysis,
  };

  sessionStorage.setItem(RESUME_KEY, resumeText);
  sessionStorage.setItem(LAST_KEY, JSON.stringify(analysis));

  const existing: AnalysisRecord[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  const updated = [record, ...existing].slice(0, 10);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function getHistory(): AnalysisRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getLastAnalysis(): ResumeAnalysis | null {
  if (typeof window === "undefined") return null;
  try {
    const data = sessionStorage.getItem(LAST_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
