import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
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
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-20 text-center md:py-32">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Make your week actually doable
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Afrek turns your endless backlog into a realistic weekly schedule,
          with optional end-to-end encryption for your most sensitive work.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            Get started
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/pricing"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            View pricing
          </Link>
        </div>

        {/* Extended trial pill */}
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-300">
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
            <span className="rounded-full border bg-background px-4 py-2">
              Solo founders
            </span>
            <span className="rounded-full border bg-background px-4 py-2">
              Indie hackers
            </span>
            <span className="rounded-full border bg-background px-4 py-2">
              Freelancers
            </span>
            <span className="rounded-full border bg-background px-4 py-2">
              Knowledge workers
            </span>
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
            <div key={prop.title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <prop.icon className="h-5 w-5 text-primary" />
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
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
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
              className="text-sm text-primary hover:underline"
            >
              Learn more about the weekly workflow →
            </Link>
          </div>
        </div>
      </section>

      {/* Early access / Alpha section */}
      <EarlyAccessSection />

      {/* Privacy highlight */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="rounded-2xl border bg-muted/30 p-8 md:p-12">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10">
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
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                Learn how encryption works →
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
            <span className="text-4xl font-bold">$3</span>
            <span className="text-muted-foreground">/month</span>
            <span className="mx-2 text-muted-foreground">or</span>
            <span className="text-4xl font-bold">$30</span>
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
            className={cn(buttonVariants({ variant: "outline" }))}
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
            <div key={faq.question} className="border-b pb-6">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/help"
            className="text-sm text-primary hover:underline"
          >
            More questions? Visit our help center →
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">
            Plan your next week in 5 minutes
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join others who have taken control of their weekly planning.
          </p>
          <Link
            href="/sign-up"
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            Start using Afrek
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
