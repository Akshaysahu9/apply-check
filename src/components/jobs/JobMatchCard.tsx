import type { JobMatchResult } from "@/lib/job-matcher";
import Badge from "@/components/ui/Badge";
import { MapPin, IndianRupee, Clock, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export default function JobMatchCard({ match, rank }: { match: JobMatchResult; rank?: number }) {
  const scoreColor =
    match.matchScore >= 80 ? "text-success bg-emerald-50 border-emerald-200"
    : match.matchScore >= 60 ? "text-warning bg-amber-50 border-amber-200"
    : "text-ink-muted bg-paper border-border";

  return (
    <div className="bg-surface border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {rank && (
              <span className="text-xs font-medium text-ink-faint bg-paper px-2 py-0.5 rounded border border-border">
                #{rank}
              </span>
            )}
            <Badge variant={match.applyPriority === "High" ? "success" : match.applyPriority === "Medium" ? "warning" : "default"}>
              {match.applyPriority} Priority
            </Badge>
            <h3 className="font-medium text-ink">{match.title}</h3>
          </div>
          <p className="text-sm text-navy font-medium">{match.company}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-ink-faint">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{match.location}</span>
            <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{match.salary}</span>
            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{match.experience}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{match.posted}</span>
          </div>
        </div>
        <div className={cn("px-4 py-3 rounded-xl text-center border min-w-[80px]", scoreColor)}>
          <span className="text-2xl font-bold block">{match.matchScore}%</span>
          <span className="text-[10px] uppercase tracking-wide">Match</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Skills", value: match.skillMatch },
          { label: "Experience", value: match.experienceMatch },
          { label: "Resume", value: match.resumeQuality },
        ].map((bar) => (
          <div key={bar.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-ink-faint">{bar.label}</span>
              <span className="text-ink font-medium">{bar.value}%</span>
            </div>
            <div className="h-1.5 bg-paper rounded-full overflow-hidden">
              <div className="h-full bg-navy rounded-full" style={{ width: `${bar.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-ink-muted mt-3 leading-relaxed">{match.recommendation}</p>

      <div className="mt-4 pt-4 border-t border-border grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-ink-faint mb-2">Matched skills</p>
          <div className="flex flex-wrap gap-1.5">
            {match.matchedSkills.length > 0 ? match.matchedSkills.map((s) => (
              <Badge key={s} variant="success">{s}</Badge>
            )) : <span className="text-xs text-ink-faint">None detected</span>}
          </div>
        </div>
        <div>
          <p className="text-xs text-ink-faint mb-2">Gaps to address</p>
          <div className="flex flex-wrap gap-1.5">
            {match.missingSkills.length > 0 ? match.missingSkills.map((s) => (
              <Badge key={s} variant="warning">{s}</Badge>
            )) : <span className="text-xs text-success">All required skills covered!</span>}
          </div>
        </div>
      </div>

      {match.bonusSkills.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-ink-faint mb-1.5">Bonus skills (preferred)</p>
          <div className="flex flex-wrap gap-1.5">
            {match.bonusSkills.map((s) => (
              <Badge key={s} variant="navy">{s}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
