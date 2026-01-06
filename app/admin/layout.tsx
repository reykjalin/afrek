import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ConvexClientProvider } from "@/lib/convexClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.role !== "admin") {
    redirect("/tasks");
  }

  return (
    <ConvexClientProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-6">
              <Link href="/admin" className="text-xl font-bold">
                Admin
              </Link>
              <Link
                href="/admin/dashboard"
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="text-muted-foreground hover:text-foreground"
              >
                Users
              </Link>
              <div className="flex-1" />
              <Link
                href="/tasks"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to App
              </Link>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">{children}</main>
      </div>
    </ConvexClientProvider>
  );
}
