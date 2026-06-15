"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { ResumeAnalysis } from "@/lib/resume-analyzer";

export default function JdCompare({ analysis }: { analysis: ResumeAnalysis }) {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<{
    match: number;
    matched: string[];
    missing: string[];
  } | null>(null);

  const runCompare = () => {
    if (jd.trim().length < 30) return;

    const jdLower = jd.toLowerCase();
    const matched: string[] = [];
    const missing: string[] = [];

    for (const skill of analysis.skills) {
      if (jdLower.includes(skill.toLowerCase())) matched.push(skill);
    }

    for (const kw of analysis.missingKeywords) {
      if (jdLower.includes(kw.toLowerCase())) missing.push(kw);
    }

    // also check common tech words in JD not in resume
    const jdWords = jdLower.match(/\b(javascript|typescript|python|java|react|node|sql|aws|docker|kubernetes|agile|git)\b/g) || [];
    for (const w of [...new Set(jdWords)]) {
      const has = analysis.skills.some((s) => s.toLowerCase().includes(w));
      if (!has && !missing.some((m) => m.toLowerCase().includes(w))) {
        missing.push(w.charAt(0).toUpperCase() + w.slice(1));
      }
    }

    const total = matched.length + missing.length || 1;
    const match = Math.round((matched.length / total) * 100);

    setResult({ match, matched, missing: missing.slice(0, 8) });
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="font-medium text-ink mb-2">Compare with a job description</h3>
      <p className="text-sm text-ink-muted mb-3">
        Paste any JD from Naukri, LinkedIn, etc. to see overlap with your resume.
      </p>
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder="Paste job description here..."
        rows={4}
        className="w-full p-3 bg-paper border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-navy/20"
      />
      <div className="mt-3 flex justify-end">
        <Button size="sm" onClick={runCompare} disabled={jd.trim().length < 30}>
          Check match
        </Button>
      </div>

      {result && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-lg font-semibold text-ink mb-3">
            JD match: <span className={result.match >= 60 ? "text-success" : "text-warning"}>{result.match}%</span>
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-ink-faint mb-1.5">You already have</p>
              <div className="flex flex-wrap gap-1.5">
                {result.matched.length ? result.matched.map((s) => (
                  <Badge key={s} variant="success">{s}</Badge>
                )) : <span className="text-xs text-ink-faint">No direct overlap</span>}
              </div>
            </div>
            <div>
              <p className="text-xs text-ink-faint mb-1.5">JD asks for (add to resume)</p>
              <div className="flex flex-wrap gap-1.5">
                {result.missing.map((s) => (
                  <Badge key={s} variant="warning">{s}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
