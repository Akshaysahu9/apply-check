"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ScoreRing from "@/components/ui/ScoreRing";
import Badge from "@/components/ui/Badge";
import { getLastAnalysis, getHistory, type AnalysisRecord } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import { ArrowRight, FileSearch, Briefcase, History } from "lucide-react";
import type { ResumeAnalysis } from "@/lib/resume-analyzer";

export default function DashboardStats() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    setAnalysis(getLastAnalysis());
    setHistory(getHistory());
  }, []);

  if (!analysis) {
    return (
      <div className="bg-surface border border-dashed border-border rounded-xl p-8 text-center">
        <FileSearch className="w-10 h-10 text-ink-faint mx-auto mb-3" />
        <h3 className="font-medium text-ink mb-1">No resume analyzed yet</h3>
        <p className="text-sm text-ink-muted mb-4">Upload your resume to see your ATS score and job matches</p>
        <Link href="/dashboard/analyze">
          <Button>
            Analyze Resume
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <p className="text-xs text-ink-faint uppercase tracking-wide mb-1">Latest Analysis</p>
            <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-ink">
              Score: {analysis.overallScore}/100
              <Badge className="ml-2" variant="navy">{analysis.grade}</Badge>
            </h3>
            {analysis.detectedRole && (
              <p className="text-sm text-navy mt-1">Best fit: {analysis.roleFit[0]?.role} ({analysis.roleFit[0]?.matchPercent}%)</p>
            )}
            <p className="text-sm text-ink-muted mt-1">{analysis.skills.length} skills · {analysis.metricsCount} metrics · {analysis.experienceYears ? `${analysis.experienceYears} yrs exp` : "exp not detected"}</p>
          </div>
          <ScoreRing score={analysis.overallScore} size={100} />
        </div>
        <div className="flex gap-3 mt-4">
          <Link href="/dashboard/jobs">
            <Button size="sm">
              <Briefcase className="w-3.5 h-3.5" />
              View Job Matches
            </Button>
          </Link>
          <Link href="/dashboard/analyze">
            <Button variant="outline" size="sm">Re-analyze</Button>
          </Link>
        </div>
      </div>

      {history.length > 1 && (
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-ink-faint" />
              <h3 className="font-medium text-ink">Recent Analyses</h3>
            </div>
            <Link href="/dashboard/history" className="text-xs text-navy hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {history.slice(0, 3).map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-paper rounded-lg text-sm">
                <div>
                  <p className="font-medium text-ink truncate max-w-[200px]">{record.fileName}</p>
                  <p className="text-xs text-ink-faint">{formatDate(record.analyzedAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-ink">{record.score}/100</p>
                  <p className="text-xs text-ink-faint">{record.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
