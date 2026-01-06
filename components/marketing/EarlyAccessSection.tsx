"use client";

import { useState } from "react";
import { ChevronDown, Check, RefreshCw, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const worksWell = [
  "Capture tasks with titles, notes, and tags",
  "Weekly calendar view with day-by-day scheduling",
  "Backlog for unscheduled tasks",
  "Rich markdown editor for task notes",
  "Real-time sync across browser tabs",
  "Optional end-to-end encryption",
];

const inProgress = [
  "Recurring tasks",
  "Data export",
  "Some onboarding and UX flows",
  "Visual polish and small interaction details",
];

const expectations = [
  "Rapid updates and frequent improvements",
  "Occasional bugs — we fix them quickly",
  "Direct access to the developer",
  "Your feedback shapes what we build next",
];

export function EarlyAccessSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="early-access" className="mx-auto max-w-5xl px-4 py-20">
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between text-left"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400">
              <Zap className="h-3.5 w-3.5" />
              Early Access
            </div>
            <h2 className="text-xl font-semibold">Built for early adopters</h2>
            <p className="mt-1 text-muted-foreground">
              Afrek is in alpha. The core is solid, but we&apos;re still shaping
              the product with early users.
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>

        {expanded && (
          <div className="mt-8 grid gap-6 border-t border-amber-500/20 pt-8 md:grid-cols-3">
            {/* What works well */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                <Check className="h-4 w-4" />
                What works today
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {worksWell.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* In progress */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400">
                <RefreshCw className="h-4 w-4" />
                Still in progress
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {inProgress.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-amber-500">○</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What to expect */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                <Zap className="h-4 w-4" />
                What to expect
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {expectations.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-blue-500">→</span>
                    {item}
                  </li>
                ))}
                <li className="flex gap-2">
                  <span className="text-blue-500">→</span>
                  Extended free trials —{" "}
                  <a
                    href="mailto:support@afrek.app"
                    className="underline hover:text-foreground"
                  >
                    just ask
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {expanded && (
          <div className="mt-8 grid gap-4 border-t border-amber-500/20 pt-6 sm:grid-cols-2">
            <div className="rounded-lg bg-green-500/10 p-4">
              <h4 className="font-semibold text-green-600 dark:text-green-400">
                Great fit if you:
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Like testing new tools and giving feedback</li>
                <li>• Use Afrek for personal tasks or small projects</li>
                <li>• Want to help shape the product direction</li>
              </ul>
            </div>
            <div className="rounded-lg bg-orange-500/10 p-4">
              <h4 className="font-semibold text-orange-600 dark:text-orange-400">
                Maybe wait if you:
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Need guaranteed uptime for critical work</li>
                <li>• Can&apos;t tolerate occasional UI changes</li>
                <li>• Require features we haven&apos;t built yet</li>
              </ul>
            </div>
          </div>
        )}

        {expanded && (
          <div className="mt-6 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Is my data safe?</strong> Yes.
            Your tasks are stored securely with regular backups. You can enable
            end-to-end encryption for extra privacy. Data export is coming soon
            so you can always take your data with you.
          </div>
        )}
      </div>
    </section>
  );
}
