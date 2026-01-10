"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConvexClientProvider } from "@/lib/convexClient";
import { useCurrentUser } from "@/features/auth/hooks";
import { useConvexAuth } from "convex/react";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { user, isLoaded: userLoaded } = useCurrentUser();
  const router = useRouter();

  const isLoading = authLoading || !userLoaded;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.replace("/tasks");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading || !isAuthenticated || !isAdmin) {
    return null;
  }

  return (
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
            <Link
              href="/admin/trials"
              className="text-muted-foreground hover:text-foreground"
            >
              Trials
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
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ConvexClientProvider>
  );
}
