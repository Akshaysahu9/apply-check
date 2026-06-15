import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-navy text-white hover:bg-navy-light shadow-sm": variant === "primary",
            "bg-surface text-ink border border-border hover:bg-paper": variant === "secondary",
            "text-ink-muted hover:text-ink hover:bg-paper": variant === "ghost",
            "border border-navy text-navy hover:bg-navy hover:text-white": variant === "outline",
            "px-3 py-1.5 text-sm rounded-md": size === "sm",
            "px-4 py-2.5 text-sm rounded-lg": size === "md",
            "px-6 py-3 text-base rounded-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
