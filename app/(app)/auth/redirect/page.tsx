"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsSubscribed } from "@/features/billing";

export default function AuthRedirectPage() {
  const router = useRouter();
  const isSubscribed = useIsSubscribed();

  useEffect(() => {
    if (isSubscribed === undefined) return;

    if (isSubscribed) {
      router.replace("/tasks");
    } else {
      router.replace("/choose-plan");
    }
  }, [isSubscribed, router]);

  return null;
}
