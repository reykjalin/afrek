import { ClerkProvider } from "@clerk/nextjs";
import { MarketingHeader, MarketingFooter } from "@/components/marketing";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider dynamic>
      <div className="flex min-h-screen flex-col">
        <MarketingHeader />
        <main className="flex-1">{children}</main>
        <MarketingFooter />
      </div>
    </ClerkProvider>
  );
}
