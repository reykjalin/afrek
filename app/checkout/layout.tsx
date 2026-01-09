import { ConvexClientProvider } from "@/lib/convexClient";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
