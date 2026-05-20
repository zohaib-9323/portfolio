import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "outline";
}

export function Badge({
  children,
  className,
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-medium",
        variant === "default" &&
          "border-2 border-border-muted bg-bg-secondary text-text-secondary shadow-[var(--shadow-soft)]",
        variant === "accent" &&
          "surface-amber border-2 border-border-strong shadow-[var(--shadow-soft)]",
        variant === "outline" &&
          "border-2 border-border-strong text-text-primary",
        className
      )}
    >
      {children}
    </span>
  );
}
