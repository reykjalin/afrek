import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight">
        Choose your plan
      </h1>
      <PricingTable />
    </div>
  );
}
