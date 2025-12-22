import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Afrek</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Turn your backlog into accomplishments
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/tasks"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Get Started
        </Link>
        <Link
          href="/pricing"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Pricing
        </Link>
      </div>
    </div>
  );
}
