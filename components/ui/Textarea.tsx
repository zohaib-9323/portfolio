"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  success?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, success, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        <label htmlFor={props.id} className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
        <textarea
          className={cn(
            "flex min-h-[120px] w-full resize-none rounded-xl border-2 bg-bg-secondary/50 px-4 py-3 text-sm text-text-primary transition-all",
            "placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
            !error && !success && "border-border-muted focus-visible:border-accent",
            error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/30",
            success &&
              "border-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-red-500">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
