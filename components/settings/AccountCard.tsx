"use client";

import { useState } from "react";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useAction } from "convex/react";
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
import { User, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountCard() {
  const { loading, user, signOut } = useAuth();
  const deleteMyAccount = useAction(api.account.deleteMyAccount);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This will permanently delete all your data and cannot be undone."
      )
    ) {
      return;
    }

    if (
      !confirm(
        "This is your last chance. All your tasks and account data will be permanently deleted. Continue?"
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteMyAccount({});
      signOut({ returnTo: "/" });
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account. Please try again or contact support.");
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Account
        </CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading || !user ? (
          <>
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
          </>
        ) : (
          <>
            <div className="grid gap-1">
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="grid gap-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => signOut({ returnTo: "/" })}
              >
                Sign out
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium text-destructive">
                Danger Zone
              </p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete account"
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
