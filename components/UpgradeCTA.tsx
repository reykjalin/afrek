"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UpgradeCTA() {
  return (
    <Card className="border-amber-200 bg-amber-50 ring-amber-200 dark:border-amber-800 dark:bg-amber-950/50 dark:ring-amber-800">
      <CardContent className="flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-amber-800 dark:text-amber-200">
            Your subscription has expired. Upgrade to continue managing your
            tasks.
          </p>
        </div>
        <Button
          render={<Link href="/choose-plan" />}
          nativeButton={false}
          size="sm"
          className="shrink-0"
        >
          Renew
        </Button>
      </CardContent>
    </Card>
  );
}
