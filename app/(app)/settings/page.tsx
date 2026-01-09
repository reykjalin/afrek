"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const AccountCard = dynamic(
  () => import("@/components/settings/AccountCard").then((mod) => mod.AccountCard),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="grid gap-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Separator />
          <Skeleton className="h-9 w-24" />
        </CardContent>
      </Card>
    ),
  }
);

export default function SettingsPage() {
  const subscription = useQuery(api.subscriptions.getForCurrentUser);
  const getCustomerPortal = useAction(api.payments.getCustomerPortal);
  const [portalLoading, setPortalLoading] = useState(false);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const result = await getCustomerPortal({});
      if (result?.portalUrl) {
        window.open(result.portalUrl, "_blank");
      }
    } catch (error) {
      console.error("Failed to open customer portal:", error);
    } finally {
      setPortalLoading(false);
    }
  };

  const hasSubscription = subscription?.hasActiveSubscription;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account and subscription
          </p>
        </div>

        <AccountCard />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription === undefined ? (
              <>
                <Skeleton className="h-4 w-48" />
                <Separator />
                <Skeleton className="h-9 w-36" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {hasSubscription ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">
                        Premium subscription active
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">
                        No active subscription
                      </span>
                    </>
                  )}
                </div>

                <Separator />

                <div className="flex gap-2">
                  {hasSubscription ? (
                    <Button
                      variant="outline"
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                    >
                      {portalLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Manage subscription
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button render={<Link href="/pricing" />} nativeButton={false}>
                      View plans
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
