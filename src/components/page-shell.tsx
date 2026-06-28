import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, className }: Props) {
  return (
    <header className={cn("relative pt-32 pb-12 sm:pt-40 sm:pb-16", className)}>
      <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {eyebrow}
          </div>
        )}
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-fade-up">
          {title}
        </h1>
        {description && (
          <p
            className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
