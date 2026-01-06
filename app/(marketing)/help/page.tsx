import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  ShieldCheck,
  HelpCircle,
  Rocket,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "Help & Docs - Afrek",
  description: "Everything you need to get started with Afrek.",
};

const helpTopics = [
  {
    href: "/help/weekly-workflow",
    icon: Calendar,
    title: "Weekly Workflow Guide",
    description:
      "Learn how to use weekly planning to stay organized and get more done.",
  },
  {
    href: "/help/encryption",
    icon: ShieldCheck,
    title: "Security & Encryption",
    description:
      "Understand how optional end-to-end encryption protects your data.",
  },
];

const quickStartSteps = [
  {
    number: "1",
    title: "Sign up and log in",
    description: "Create your account to get started.",
  },
  {
    number: "2",
    title: "Add tasks to your backlog",
    description:
      "Capture everything on your mind. Add tags to organize by project or context.",
  },
  {
    number: "3",
    title: "Schedule tasks into your week",
    description:
      "From the weekly view, assign tasks to specific days. Be realistic about what you can accomplish.",
  },
  {
    number: "4",
    title: "Work through your day",
    description:
      "Check off tasks as you complete them. Add notes to capture important details.",
  },
  {
    number: "5",
    title: "Review your progress",
    description:
      "Use the completed view to see what you've accomplished and reflect on your week.",
  },
];

const faqs = [
  {
    question: "How do I move a task to a different day?",
    answer:
      "Open the task and use the quick action buttons (Today, Tomorrow, This Week) or click the date picker to choose a specific day.",
  },
  {
    question: "What happens when I complete a task?",
    answer:
      "Completed tasks are moved to the Completed view where you can review them. They stay there until you delete them.",
  },
  {
    question: "How do I use tags?",
    answer:
      "Add tags when creating or editing a task. Tags help you filter and organize tasks by project, client, or context. Click a tag to filter your view.",
  },
  {
    question: "Can I use Afrek on my phone?",
    answer:
      "Yes! Afrek works great in mobile browsers. Just visit the site and log in. A native mobile app may come in the future.",
  },
  {
    question: "What's the difference between backlog and scheduled tasks?",
    answer:
      "Backlog tasks don't have a scheduled date—they're things you want to do but haven't committed to a specific day. Scheduled tasks appear on your weekly calendar.",
  },
  {
    question: "Do I need to enable encryption?",
    answer:
      "No, encryption is optional. Your data is stored securely either way. Encryption adds an extra layer where even we can't read your task content, but it requires a passkey.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards through Stripe, including Visa, Mastercard, and American Express.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel anytime from the settings page. You'll retain access until the end of your billing period.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Help & Docs</h1>
        <p className="mt-2 text-muted-foreground">
          Everything you need to get started with Afrek and make weekly planning
          stick.
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-16">
        <div className="mb-8 flex items-center gap-3">
          <Rocket className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Quick Start</h2>
        </div>
        <div className="space-y-4">
          {quickStartSteps.map((step) => (
            <div
              key={step.number}
              className="flex gap-4 rounded-lg border bg-muted/30 p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {step.number}
              </div>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Help Topics */}
      <section className="mb-16">
        <h2 className="mb-8 text-2xl font-semibold">Guides</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {helpTopics.map((topic) => (
            <Link
              key={topic.href}
              href={topic.href}
              className="group flex gap-4 rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <topic.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-primary">
                  {topic.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {topic.description}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 self-center text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <div className="mb-8 flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b pb-4">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-lg border bg-muted/30 p-8 text-center">
        <h2 className="text-xl font-semibold">Still have questions?</h2>
        <p className="mt-2 text-muted-foreground">
          We&apos;re here to help. Reach out and we&apos;ll get back to you as
          soon as we can.
        </p>
        <a
          href="mailto:support@afrek.app"
          className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
        >
          Contact support
        </a>
      </section>
    </div>
  );
}
