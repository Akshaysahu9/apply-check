"use client";

import { useState, useEffect } from "react";
import JobMatchCard from "@/components/jobs/JobMatchCard";
import Button from "@/components/ui/Button";
import type { JobMatchResult } from "@/lib/job-matcher";
import { Briefcase, Search, Filter } from "lucide-react";

export default function JobsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState<JobMatchResult[]>([]);
  const [customJd, setCustomJd] = useState("");
  const [mode, setMode] = useState<"listings" | "custom">("listings");
  const [hasResume, setHasResume] = useState(false);
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
    const text = sessionStorage.getItem("lastResumeText");
    setHasResume(!!text && text.length > 50);
  }, []);

  const runMatch = async (custom = false) => {
    setLoading(true);
    setError("");
    setMatches([]);

    const resumeText = sessionStorage.getItem("lastResumeText") || "";
    if (!resumeText || resumeText.length < 50) {
      setError("Please analyze your resume first on the Resume Analyzer page.");
      setLoading(false);
      return;
    }

    try {
      const body: Record<string, string> = { resumeText };
      if (custom && customJd.trim()) body.customJobDescription = customJd;

      const res = await fetch("/api/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Matching failed");

      setMatches(custom ? [data.match] : data.matches);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filtered = matches.filter((m) => m.matchScore >= minScore);
  const highPriority = filtered.filter((m) => m.applyPriority === "High").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-ink">
          Job Matching
        </h1>
        <p className="text-ink-muted mt-1">
          Compare your resume against 10 sample openings (Razorpay, Flipkart, etc.)
        </p>
      </div>

      {!hasResume && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-warning">
          Upload and analyze your resume first to get personalized job matches with accuracy scores.
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <div className="flex gap-2 p-1 bg-paper rounded-lg w-fit border border-border">
          <button
            onClick={() => setMode("listings")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              mode === "listings" ? "bg-surface shadow-sm text-ink" : "text-ink-muted"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Company Listings
          </button>
          <button
            onClick={() => setMode("custom")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              mode === "custom" ? "bg-surface shadow-sm text-ink" : "text-ink-muted"
            }`}
          >
            <Search className="w-4 h-4" />
            Custom JD
          </button>
        </div>

        {mode === "custom" && (
          <textarea
            value={customJd}
            onChange={(e) => setCustomJd(e.target.value)}
            placeholder="Paste any job description here to check your match score..."
            rows={6}
            className="w-full p-4 bg-paper border border-border rounded-xl text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy resize-none"
          />
        )}

        <div className="flex justify-end">
          <Button
            onClick={() => runMatch(mode === "custom")}
            disabled={loading || (mode === "custom" && customJd.trim().length < 30)}
            size="lg"
          >
            {loading ? "Running match..." : mode === "custom" ? "Check this JD" : "Run job match"}
          </Button>
        </div>

        {error && <p className="text-danger text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
      </div>

      {matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-medium text-ink">
                {filtered.length} matches found
                {highPriority > 0 && (
                  <span className="text-success ml-2 text-sm">({highPriority} high priority)</span>
                )}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-ink-faint" />
              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="text-sm border border-border rounded-lg px-3 py-1.5 bg-surface text-ink"
              >
                <option value={0}>All matches</option>
                <option value={50}>50%+ only</option>
                <option value={70}>70%+ only</option>
                <option value={80}>80%+ only</option>
              </select>
            </div>
          </div>

          {filtered.map((match, i) => (
            <JobMatchCard key={match.jobId} match={match} rank={mode === "listings" ? i + 1 : undefined} />
          ))}

          {filtered.length === 0 && (
            <p className="text-sm text-ink-faint text-center py-8">
              No matches above {minScore}%. Try lowering the filter or improving your resume.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
