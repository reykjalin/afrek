import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
        <p className="mt-2 text-muted-foreground">
          Simple pricing for everyone
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Monthly</h2>
          <p className="mt-2 text-3xl font-bold">$3</p>
          <p className="text-muted-foreground">per month</p>
          <Button className="mt-4 w-full">Subscribe</Button>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Yearly</h2>
          <p className="mt-2 text-3xl font-bold">$30</p>
          <p className="text-muted-foreground">per year (save $6)</p>
          <Button className="mt-4 w-full">Subscribe</Button>
        </div>
      </div>

      <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
        ← Back
      </Link>
    </div>
  );
}
