import { MarketingHeader, MarketingFooter } from "@/components/marketing";
import { ConvexClientProvider } from "@/lib/convexClient";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <div className="flex min-h-screen flex-col">
        <MarketingHeader />
        <main className="flex-1">{children}</main>
        <MarketingFooter />
      </div>
    </ConvexClientProvider>
  );
}
