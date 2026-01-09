import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { PricingCards } from "@/components/marketing/PricingCards";

export const metadata = {
  title: "Pricing - Afrek",
  description: "Simple, predictable pricing for Afrek task management.",
};

const features = [
  "Weekly calendar & backlog views",
  "Unlimited tasks, notes, and tags",
  "Rich markdown editor for notes",
  "Optional end-to-end encryption",
  "Access on all your devices",
  "Real-time sync across devices",
  "Future updates included",
];

const faqs = [
  {
    question: "Is there a free trial?",
    answer: "Yes, all plans include a 30-day free trial.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards including Visa, Mastercard, and American Express.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "You'll retain access to Afrek until the end of your current billing period. After that, you can still log in to export your data, but you won't be able to create or edit tasks.",
  },
  {
    question: "Can I switch between monthly and yearly?",
    answer:
      "Yes, you can switch plans at any time from your account settings. The yearly plan gives you a full year for the price of 10 months.",
  },
  {
    question: "Do I need to pay for encryption?",
    answer:
      "No, encryption is included in every plan at no extra cost. It's completely optional—you can enable it anytime from the app.",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Simple, predictable pricing
        </h1>
        <p className="mt-2 text-muted-foreground">
          One plan with everything included. Cancel anytime.
        </p>
      </div>

      {/* Feature list */}
      <div className="mb-12 rounded-lg border bg-muted/30 p-6">
        <h2 className="mb-4 text-lg font-semibold">Everything you need</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mb-12">
        <PricingCards />
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="mb-6 text-xl font-semibold">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b pb-4">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href="/sign-up" className={cn(buttonVariants({ size: "lg" }))}>
          Get started
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">
          Have questions?{" "}
          <Link href="/help" className="text-primary hover:underline">
            Visit our help center
          </Link>
        </p>
      </div>
    </div>
  );
}
