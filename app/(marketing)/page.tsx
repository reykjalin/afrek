import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { EarlyAccessSection } from "@/components/marketing";
import {
  Calendar,
  FileText,
  Inbox,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const valueProps = [
  {
    icon: Calendar,
    title: "Weekly-first planning",
    description:
      "See your week at a glance. Schedule tasks into specific days so nothing floats in 'someday' forever.",
  },
  {
    icon: FileText,
    title: "Deep task notes",
    description:
      "Each task expands into rich markdown notes, so context, links, and ideas live where you do the work.",
  },
  {
    icon: Inbox,
    title: "Backlog to done",
    description:
      "A dedicated backlog view and simple scheduling keep you moving items into this week, not next year.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    description:
      "Optional end-to-end encryption means we can't read your task content—even if we wanted to.",
  },
];

const steps = [
  {
    number: "1",
    title: "Capture",
    description: "Add everything to your backlog with tags and quick notes.",
  },
  {
    number: "2",
    title: "Plan your week",
    description: "Schedule tasks into specific days in the weekly view.",
  },
  {
    number: "3",
    title: "Execute & review",
    description: "Check off tasks, take notes, and review in the completed view.",
  },
];

const faqs = [
  {
    question: "How is this different from Todoist or Notion?",
    answer:
      "Afrek focuses on weekly planning as the default workflow, not endless lists or complex databases. Plus, we offer optional client-side encryption for privacy.",
  },
  {
    question: "Do I need to use encryption?",
    answer:
      "No, encryption is completely optional. Your data is stored securely either way—encryption just adds an extra layer where even we can't read your content.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Data export is on our roadmap. We believe you should own your data and be able to take it with you.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "Afrek works great in mobile browsers. A native app is something we're considering for the future.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Alpha banner */}
      <div className="border-b bg-amber-500/10 px-4 py-3 text-center text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2 py-0.5 font-medium text-amber-600 dark:text-amber-400">
          Alpha
        </span>
        <span className="text-muted-foreground">
          {" "}— Core features work; some polish and features still in progress.{" "}
          <a href="#early-access" className="text-amber-600 hover:underline dark:text-amber-400">
            Learn more ↓
          </a>
        </span>
      </div>

      {/* Hero */}
      <section className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-20 text-center md:py-32">
        {/* Soft weekly columns background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* Center halo */}
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/15 via-purple-500/10 to-pink-500/15 blur-3xl" />
          
          {/* Soft horizontal bars - stacked with fade towards bottom */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3%] opacity-30 md:opacity-40">
            <div className="h-[10%] w-[70%] -translate-x-[5%] rounded-full bg-gradient-to-r from-primary/50 via-purple-500/40 to-primary/20 blur-md" />
            <div className="h-[8%] w-[55%] translate-x-[12%] rounded-full bg-gradient-to-r from-purple-500/45 via-primary/35 to-purple-400/20 blur-md" />
            <div className="h-[9%] w-[65%] -translate-x-[8%] rounded-full bg-gradient-to-r from-purple-400/40 via-pink-500/30 to-purple-500/15 blur-md" />
            <div className="h-[7%] w-[50%] translate-x-[15%] rounded-full bg-gradient-to-r from-pink-500/35 via-purple-500/25 to-pink-400/10 opacity-80 blur-md" />
            <div className="h-[8%] w-[60%] -translate-x-[10%] rounded-full bg-gradient-to-r from-pink-400/30 via-pink-500/20 to-purple-400/10 opacity-60 blur-md" />
            <div className="h-[6%] w-[45%] translate-x-[8%] rounded-full bg-gradient-to-r from-pink-500/25 via-pink-400/15 to-transparent opacity-40 blur-md" />
            <div className="h-[7%] w-[40%] -translate-x-[5%] rounded-full bg-gradient-to-r from-pink-400/20 via-pink-300/10 to-transparent opacity-20 blur-md" />
          </div>
        </div>

        <h1 className="animate-fade-in text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Make your week{" "}
          <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            actually doable
          </span>
        </h1>
        <p className="max-w-2xl animate-fade-in text-lg text-muted-foreground opacity-0 [animation-delay:150ms] sm:text-xl">
          Afrek turns your endless backlog into a realistic weekly schedule,
          with optional end-to-end encryption for your most sensitive work.
        </p>
        <div className="flex animate-fade-in flex-col gap-4 opacity-0 [animation-delay:300ms] sm:flex-row">
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ size: "lg" }),
              "traveling-light-button gap-2 transition-transform hover:scale-105"
            )}
          >
            Get started
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "transition-transform hover:scale-105"
            )}
          >
            View pricing
          </Link>
        </div>
        <a
          href="https://github.com/reykjalin/afrek"
          target="_blank"
          rel="noreferrer"
          className="animate-fade-in text-sm text-muted-foreground opacity-0 underline transition-colors [animation-delay:350ms] hover:text-foreground"
        >
          View source on GitHub
        </a>

        {/* Extended trial pill */}
        <div className="animate-fade-in inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-700 opacity-0 transition-colors [animation-delay:450ms] hover:bg-emerald-500/20 dark:text-emerald-300">
          <Sparkles className="h-4 w-4" />
          <span>
            Extended free trials during alpha —{" "}
            <a
              href="mailto:support@afrek.app"
              className="underline hover:text-emerald-600 dark:hover:text-emerald-200"
            >
              just ask
            </a>
          </span>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">
            Built for people who think in weeks
          </h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {["Solo founders", "Indie hackers", "Freelancers", "Knowledge workers"].map(
              (persona) => (
                <span
                  key={persona}
                  className="traveling-light rounded-full border border-border px-4 py-2 transition-colors hover:text-foreground"
                >
                  {persona}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight">
          Everything you need to plan your week
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {valueProps.map((prop) => (
            <div
              key={prop.title}
              className="group flex gap-4 rounded-xl border border-transparent p-4 transition-all hover:border-border hover:bg-muted/50 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <prop.icon className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
              </div>
              <div>
                <h3 className="font-semibold">{prop.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {prop.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight">
            How it works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="group text-center">
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/25"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {step.number}
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/help/weekly-workflow"
              className="inline-flex items-center gap-1 text-sm text-primary transition-all hover:gap-2 hover:underline"
            >
              Learn more about the weekly workflow
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Early access / Alpha section */}
      <EarlyAccessSection />

      {/* Privacy highlight */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="traveling-light-card group rounded-2xl border bg-muted/30 p-8 transition-all hover:border-primary/30 hover:shadow-lg md:p-12">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:bg-primary/20 group-hover:scale-110">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Your data, your control</h2>
              <p className="mt-2 text-muted-foreground">
                By default, Afrek stores your tasks securely using industry-standard
                best practices. Want more? Enable end-to-end encryption to ensure
                your task titles, notes, and tags are encrypted in your browser
                before they ever reach our servers.
              </p>
              <Link
                href="/help/encryption"
                className="mt-4 inline-flex items-center gap-1 text-sm text-primary transition-all hover:gap-2 hover:underline"
              >
                Learn how encryption works
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">
            Simple, predictable pricing
          </h2>
          <div className="mb-4 flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold transition-colors hover:text-primary">$3</span>
            <span className="text-muted-foreground">/month</span>
            <span className="mx-2 text-muted-foreground">or</span>
            <span className="text-4xl font-bold transition-colors hover:text-primary">$30</span>
            <span className="text-muted-foreground">/year</span>
          </div>
          <p className="mb-2 text-sm text-muted-foreground">
            No hidden fees. Cancel anytime.
          </p>
          <p className="mb-8 text-xs text-muted-foreground">
            Extended free trials during alpha —{" "}
            <a
              href="mailto:support@afrek.app"
              className="underline hover:text-foreground"
            >
              just ask
            </a>
            .
          </p>
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "transition-transform hover:scale-105"
            )}
          >
            See full pricing
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20">
        <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="border-b pb-6 transition-colors hover:border-primary/30"
            >
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/help"
            className="inline-flex items-center gap-1 text-sm text-primary transition-all hover:gap-2 hover:underline"
          >
            More questions? Visit our help center
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative border-t bg-muted/30">
        {/* Gradient accent */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-r from-primary/10 via-purple-500/5 to-pink-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">
            Plan your next week in 5 minutes
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join others who have taken control of their weekly planning.
          </p>
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ size: "lg" }),
              "traveling-light-button gap-2 transition-transform hover:scale-105"
            )}
          >
            Start using Afrek
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
