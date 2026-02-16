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
                <label
                    htmlFor={props.id}
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                    {label}
                </label>
                <div className="relative">
                    <textarea
                        className={cn(
                            "flex min-h-[120px] w-full rounded-xl border-2 bg-neutral-50/50 dark:bg-neutral-900/50 px-4 py-3 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                            "placeholder:text-neutral-500",
                            // Theme-aware colors
                            "text-neutral-900 dark:text-neutral-100",

                            // Default state
                            !error && !success && "border-neutral-200 dark:border-neutral-800 focus-visible:border-accent focus-visible:ring-accent/30",

                            // Error state
                            error && "border-red-500 dark:border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/30",

                            // Success state
                            success && "border-green-500 dark:border-green-400 focus-visible:border-green-500 focus-visible:ring-green-500/30",

                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-red-500 dark:text-red-400 animate-in fade-in slide-in-from-top-1">
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
