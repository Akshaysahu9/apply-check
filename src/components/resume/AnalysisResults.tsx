"use client";

import type { ResumeAnalysis } from "@/lib/resume-analyzer";
import ScoreRing from "@/components/ui/ScoreRing";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  CheckCircle2, AlertCircle, Lightbulb, Tag, Target, Download,
  Check, X, Zap, GraduationCap,
} from "lucide-react";
import Link from "next/link";
import JdCompare from "@/components/resume/JdCompare";
import { Mail, Phone, Link2, Code2, User } from "lucide-react";

export default function AnalysisResults({
  analysis,
  fileName,
}: {
  analysis: ResumeAnalysis;
  fileName: string;
}) {
  const categoryLabels: Record<string, string> = {
    languages: "Languages",
    frontend: "Frontend",
    backend: "Backend",
    databases: "Databases",
    cloud: "Cloud & DevOps",
    data: "Data & ML",
    tools: "Tools",
    soft: "Soft Skills",
  };

  const downloadReport = () => {
    const report = [
      `ApplyCheck Resume Report`,
      `File: ${fileName}`,
      `Date: ${new Date().toLocaleDateString("en-IN")}`,
      ``,
      `Overall Score: ${analysis.overallScore}/100 (Grade: ${analysis.grade})`,
      `ATS: ${analysis.atsScore} | Content: ${analysis.contentScore} | Structure: ${analysis.structureScore} | Impact: ${analysis.impactScore}`,
      ``,
      `Detected Role: ${analysis.detectedRole || "Not detected"}`,
      `Experience: ${analysis.experienceYears ? analysis.experienceYears + " years" : "Not detected"}`,
      `Skills (${analysis.skills.length}): ${analysis.skills.join(", ")}`,
      ``,
      `Strengths:`,
      ...analysis.strengths.map((s) => `  • ${s}`),
      ``,
      `Improvements:`,
      ...analysis.improvements.map((s) => `  • ${s}`),
      ``,
      `Best Role Fit: ${analysis.roleFit[0]?.role} (${analysis.roleFit[0]?.matchPercent}%)`,
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-[family-name:var(--font-fraunces)] font-semibold text-ink">
              Analysis Results
            </h2>
            <span className="px-2.5 py-0.5 rounded-md bg-navy text-white text-sm font-bold">
              {analysis.grade}
            </span>
          </div>
          <p className="text-sm text-ink-faint">{fileName}</p>
          {analysis.detectedRole && (
            <p className="text-sm text-navy font-medium mt-1">
              Detected role: {analysis.detectedRole}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ScoreRing score={analysis.overallScore} label="Overall" />
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" onClick={downloadReport}>
              <Download className="w-3.5 h-3.5" />
              Download Report
            </Button>
            <Link href="/dashboard/jobs">
              <Button size="sm" className="w-full">
                <Target className="w-3.5 h-3.5" />
                Find Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "ATS Score", score: analysis.atsScore, color: "bg-navy" },
          { label: "Content", score: analysis.contentScore, color: "bg-navy" },
          { label: "Structure", score: analysis.structureScore, color: "bg-navy" },
          { label: "Impact", score: analysis.impactScore, color: "bg-accent" },
        ].map((item) => (
          <div key={item.label} className="bg-surface border border-border rounded-xl p-4">
            <p className="text-xs text-ink-faint uppercase tracking-wide mb-1">{item.label}</p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-semibold text-ink">{item.score}</span>
              <span className="text-xs text-ink-faint mb-1">/100</span>
            </div>
            <div className="mt-2 h-1.5 bg-paper rounded-full overflow-hidden">
              <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {(analysis.contact.name || analysis.contact.email) && (
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-medium text-ink mb-3">Profile parsed from resume</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {analysis.contact.name && (
              <div className="flex items-center gap-2 text-ink-muted">
                <User className="w-4 h-4 text-navy" />{analysis.contact.name}
              </div>
            )}
            {analysis.contact.email && (
              <div className="flex items-center gap-2 text-ink-muted">
                <Mail className="w-4 h-4 text-navy" />{analysis.contact.email}
              </div>
            )}
            {analysis.contact.phone && (
              <div className="flex items-center gap-2 text-ink-muted">
                <Phone className="w-4 h-4 text-navy" />{analysis.contact.phone}
              </div>
            )}
            {analysis.contact.linkedIn && (
              <div className="flex items-center gap-2 text-ink-muted truncate">
                <Link2 className="w-4 h-4 text-navy shrink-0" />{analysis.contact.linkedIn}
              </div>
            )}
            {analysis.contact.github && (
              <div className="flex items-center gap-2 text-ink-muted truncate">
                <Code2 className="w-4 h-4 text-navy shrink-0" />{analysis.contact.github}
              </div>
            )}
          </div>
          <p className="text-xs text-ink-faint mt-3">{analysis.pageAdvice}</p>
          <p className="text-xs text-ink-faint">Readability: {analysis.readability} · {analysis.bulletCount} bullet points</p>
        </div>
      )}

      {analysis.keywordDensity.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-medium text-ink mb-3">Keyword frequency</h3>
          <div className="space-y-2">
            {analysis.keywordDensity.slice(0, 8).map((kw) => (
              <div key={kw.word} className="flex items-center gap-3">
                <span className="text-sm text-ink w-28 truncate">{kw.word}</span>
                <div className="flex-1 h-2 bg-paper rounded-full overflow-hidden">
                  <div
                    className="h-full bg-navy rounded-full"
                    style={{ width: `${Math.min(100, kw.count * 25)}%` }}
                  />
                </div>
                <span className="text-xs text-ink-faint w-6">{kw.count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-navy" />
          <h3 className="font-medium text-ink">Role fit (from skills)</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {analysis.roleFit.map((role) => (
            <div key={role.role} className="flex items-center justify-between p-3 bg-paper rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium text-ink">{role.role}</p>
                <p className="text-xs text-ink-faint mt-0.5">{role.matchedSkills.join(", ") || "No overlap"}</p>
              </div>
              <span className={`text-lg font-bold ${role.matchPercent >= 70 ? "text-success" : role.matchPercent >= 50 ? "text-warning" : "text-ink-faint"}`}>
                {role.matchPercent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="font-medium text-ink mb-4">Resume Checklist</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {analysis.sectionChecklist.map((item) => (
            <div key={item.name} className={`flex items-center gap-2.5 p-2.5 rounded-lg text-sm ${item.found ? "bg-emerald-50/50" : "bg-paper"}`}>
              {item.found ? (
                <Check className="w-4 h-4 text-success shrink-0" />
              ) : (
                <X className="w-4 h-4 text-ink-faint shrink-0" />
              )}
              <span className={item.found ? "text-ink" : "text-ink-muted"}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <h3 className="font-medium text-ink">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="text-sm text-ink-muted flex gap-2">
                <span className="text-success mt-0.5 shrink-0">•</span>{s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-warning" />
            <h3 className="font-medium text-ink">Improvements</h3>
          </div>
          <ul className="space-y-2">
            {analysis.improvements.map((s, i) => (
              <li key={i} className="text-sm text-ink-muted flex gap-2">
                <span className="text-warning mt-0.5 shrink-0">•</span>{s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-navy" />
          <h3 className="font-medium text-ink">Detected Skills ({analysis.skills.length})</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(analysis.skillsByCategory).map(([cat, skills]) => (
            <div key={cat}>
              <p className="text-xs text-ink-faint uppercase tracking-wide mb-2">{categoryLabels[cat] || cat}</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="navy">{skill}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {analysis.missingKeywords.length > 0 && (
        <div className="bg-accent-soft border border-accent/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-accent" />
            <h3 className="font-medium text-ink">Skills worth adding</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((kw) => (
              <Badge key={kw} variant="warning">{kw}</Badge>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
        {[
          { label: "Words", value: analysis.wordCount },
          { label: "Experience", value: analysis.experienceYears ? `${analysis.experienceYears} yrs` : "—" },
          { label: "Metrics", value: analysis.metricsCount },
          { label: "Action Verbs", value: analysis.actionVerbs.length },
          { label: "Sections", value: analysis.sections.length },
          { label: "Contact", value: [analysis.hasEmail, analysis.hasPhone, analysis.hasLinkedIn, analysis.hasGitHub].filter(Boolean).length + "/4" },
        ].map((stat) => (
          <div key={stat.label} className="bg-paper rounded-lg p-3 border border-border">
            <p className="text-lg font-semibold text-ink">{stat.value}</p>
            <p className="text-xs text-ink-faint">{stat.label}</p>
          </div>
        ))}
      </div>

      {(analysis.education.length > 0 || analysis.actionVerbs.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-4">
          {analysis.education.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-navy" />
                <h3 className="font-medium text-ink">Education Detected</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.education.map((e) => (
                  <Badge key={e}>{e}</Badge>
                ))}
              </div>
            </div>
          )}
          {analysis.actionVerbs.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-accent" />
                <h3 className="font-medium text-ink">Action verbs found</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.actionVerbs.map((v) => (
                  <Badge key={v} variant="success">{v}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(analysis.projects.length > 0 || analysis.certifications.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-4">
          {analysis.projects.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <h3 className="font-medium text-ink mb-3">Projects found</h3>
              <ul className="space-y-2">
                {analysis.projects.map((p, i) => (
                  <li key={i} className="text-sm text-ink-muted border-l-2 border-navy/30 pl-3">{p}</li>
                ))}
              </ul>
            </div>
          )}
          {analysis.certifications.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <h3 className="font-medium text-ink mb-3">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.certifications.map((c) => (
                  <Badge key={c}>{c}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <JdCompare analysis={analysis} />
    </div>
  );
}
