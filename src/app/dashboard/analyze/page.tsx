"use client";

import { useState } from "react";
import UploadZone from "@/components/resume/UploadZone";
import AnalysisResults from "@/components/resume/AnalysisResults";
import type { ResumeAnalysis } from "@/lib/resume-analyzer";
import { saveAnalysis } from "@/lib/storage";

export default function AnalyzePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    analysis: ResumeAnalysis;
    fileName: string;
  } | null>(null);

  const handleAnalyze = async (file: File | null, text: string) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      if (file) formData.append("resume", file);
      if (text) formData.append("text", text);

      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      const resumeText = data.extractedText || text;
      saveAnalysis(data.fileName, data.analysis, resumeText);

      setResult({
        analysis: data.analysis,
        fileName: data.fileName,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-ink">
          Resume Analyzer
        </h1>
        <p className="text-ink-muted mt-1">
          Upload a PDF or paste text — you get ATS score, skills found, and what to fix
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <UploadZone onAnalyze={handleAnalyze} loading={loading} />
        {error && (
          <p className="text-danger text-sm mt-4 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
        )}
      </div>

      {result && (
        <AnalysisResults analysis={result.analysis} fileName={result.fileName} />
      )}
    </div>
  );
}
