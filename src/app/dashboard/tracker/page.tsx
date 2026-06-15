"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Plus, Trash2 } from "lucide-react";

interface Application {
  id: string;
  company: string;
  role: string;
  matchScore: number;
  status: "Applied" | "Interview" | "Rejected" | "Offer";
  date: string;
}

const KEY = "applycheck_applications";

export default function TrackerPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [matchScore, setMatchScore] = useState("");

  useEffect(() => {
    try {
      setApps(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
      setApps([]);
    }
  }, []);

  const save = (list: Application[]) => {
    setApps(list);
    localStorage.setItem(KEY, JSON.stringify(list));
  };

  const add = () => {
    if (!company.trim() || !role.trim()) return;
    const entry: Application = {
      id: Date.now().toString(),
      company: company.trim(),
      role: role.trim(),
      matchScore: parseInt(matchScore) || 0,
      status: "Applied",
      date: new Date().toISOString().split("T")[0],
    };
    save([entry, ...apps]);
    setCompany("");
    setRole("");
    setMatchScore("");
  };

  const remove = (id: string) => save(apps.filter((a) => a.id !== id));

  const updateStatus = (id: string, status: Application["status"]) => {
    save(apps.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-ink">
          Application tracker
        </h1>
        <p className="text-ink-muted mt-1 text-sm">
          Keep track of where you applied. Saved in your browser only.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="font-medium text-ink mb-3">Add application</h3>
        <div className="grid sm:grid-cols-4 gap-3">
          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-paper"
          />
          <input
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-paper"
          />
          <input
            placeholder="Match %"
            type="number"
            value={matchScore}
            onChange={(e) => setMatchScore(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-paper"
          />
          <Button onClick={add} className="w-full">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>

      {apps.length === 0 ? (
        <p className="text-sm text-ink-faint text-center py-12 border border-dashed border-border rounded-xl">
          No applications logged yet. Run job match first, then add entries here.
        </p>
      ) : (
        <div className="space-y-2">
          {apps.map((app) => (
            <div key={app.id} className="bg-surface border border-border rounded-xl p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <p className="font-medium text-ink">{app.role}</p>
                <p className="text-sm text-navy">{app.company}</p>
                <p className="text-xs text-ink-faint">{app.date}</p>
              </div>
              {app.matchScore > 0 && (
                <Badge variant={app.matchScore >= 70 ? "success" : "warning"}>
                  {app.matchScore}% match
                </Badge>
              )}
              <select
                value={app.status}
                onChange={(e) => updateStatus(app.id, e.target.value as Application["status"])}
                className="text-sm border border-border rounded-lg px-2 py-1.5 bg-paper"
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Rejected</option>
                <option>Offer</option>
              </select>
              <button onClick={() => remove(app.id)} className="text-ink-faint hover:text-danger p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
