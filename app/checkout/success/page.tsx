import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "Payment Successful - Afrek",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-2xl font-bold">Payment Successful!</h1>
        <p className="mt-4 text-muted-foreground">
          Thank you for subscribing to Afrek. Your account has been upgraded and
          you now have full access to all features.
        </p>
        <div className="mt-8">
          <Link
            href="/tasks"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Go to your tasks
          </Link>
        </div>
      </div>
    </div>
  );
}
