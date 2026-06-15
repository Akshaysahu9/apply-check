import { cn } from "@/lib/utils";

export default function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "navy";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-paper text-ink-muted border border-border": variant === "default",
          "bg-emerald-50 text-success": variant === "success",
          "bg-amber-50 text-warning": variant === "warning",
          "bg-red-50 text-danger": variant === "danger",
          "bg-blue-50 text-navy": variant === "navy",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
