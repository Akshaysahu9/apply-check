"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHistory, type AnalysisRecord } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { History, FileSearch } from "lucide-react";

export default function HistoryPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    setRecords(getHistory());
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-ink">
          Analysis History
        </h1>
        <p className="text-ink-muted mt-1">Your last 10 resume analyses stored locally</p>
      </div>

      {records.length === 0 ? (
        <div className="bg-surface border border-dashed border-border rounded-xl p-12 text-center">
          <History className="w-10 h-10 text-ink-faint mx-auto mb-3" />
          <p className="text-ink-muted mb-4">No analysis history yet</p>
          <Link href="/dashboard/analyze">
            <Button>
              <FileSearch className="w-4 h-4" />
              Analyze Resume
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-ink">{record.fileName}</h3>
                  <p className="text-xs text-ink-faint mt-1">{formatDate(record.analyzedAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-ink">{record.score}</p>
                  <Badge variant="navy">{record.grade}</Badge>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-muted">
                <span>{record.skillsCount} skills</span>
                <span>·</span>
                <span>ATS {record.analysis.atsScore}</span>
                <span>·</span>
                <span>Impact {record.analysis.impactScore}</span>
                {record.analysis.detectedRole && (
                  <>
                    <span>·</span>
                    <span>{record.analysis.detectedRole}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
