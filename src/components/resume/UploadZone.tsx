"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface UploadZoneProps {
  onAnalyze: (file: File | null, text: string) => void;
  loading?: boolean;
}

export default function UploadZone({ onAnalyze, loading }: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState<"upload" | "paste">("upload");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleSubmit = () => {
    onAnalyze(file, text);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-paper rounded-lg w-fit border border-border">
        <button
          onClick={() => setMode("upload")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
            mode === "upload" ? "bg-surface shadow-sm text-ink" : "text-ink-muted"
          )}
        >
          Upload file
        </button>
        <button
          onClick={() => setMode("paste")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
            mode === "paste" ? "bg-surface shadow-sm text-ink" : "text-ink-muted"
          )}
        >
          Paste text
        </button>
      </div>

      {mode === "upload" ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-12 text-center transition-colors",
            dragOver ? "border-navy bg-blue-50/50" : "border-border bg-surface"
          )}
        >
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-navy" />
              <div className="text-left">
                <p className="font-medium text-ink">{file.name}</p>
                <p className="text-sm text-ink-faint">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => setFile(null)} className="p-1 hover:bg-paper rounded">
                <X className="w-4 h-4 text-ink-faint" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-ink-faint mx-auto mb-4" />
              <p className="text-ink font-medium mb-1">Drop your resume here</p>
              <p className="text-sm text-ink-faint mb-4">PDF or TXT, up to 5 MB</p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <span className="inline-flex items-center px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-navy-light transition-colors">
                  Browse files
                </span>
              </label>
            </>
          )}
        </div>
      ) : (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your resume content here..."
          rows={12}
          className="w-full p-4 bg-surface border border-border rounded-xl text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy resize-none"
        />
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading || (mode === "upload" ? !file : text.trim().length < 50)}
          size="lg"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </Button>
      </div>
    </div>
  );
}
