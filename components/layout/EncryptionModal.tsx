"use client";

import { useState } from "react";
import Link from "next/link";
import { useEncryption } from "@/features/crypto";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, ShieldCheck, ShieldOff } from "lucide-react";

interface EncryptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EncryptionModal({ open, onOpenChange }: EncryptionModalProps) {
  const {
    enabled,
    locked,
    migrating,
    prfSupported,
    error,
    enableEncryption,
    disableEncryption,
    unlock,
  } = useEncryption();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEnableEncryption = async () => {
    setLocalError(null);
    try {
      await enableEncryption();
      onOpenChange(false);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleDisableEncryption = async () => {
    setLocalError(null);
    try {
      await disableEncryption();
      onOpenChange(false);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleUnlock = async () => {
    setLocalError(null);
    try {
      await unlock();
      onOpenChange(false);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : String(e));
    }
  };

  const displayError = localError || error;

  if (migrating) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              {enabled ? "Decrypting your tasks..." : "Encrypting your tasks..."}
            </DialogTitle>
            <DialogDescription>
              Please wait while we {enabled ? "decrypt" : "encrypt"} all your
              tasks. Do not close this window.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (!enabled) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Enable Encryption
            </DialogTitle>
            <DialogDescription>
              Encrypt your task data so only you can read it. Your tasks will be
              unreadable on our servers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-amber-500">Important warnings:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      If you lose access to your passkey, your data cannot be
                      recovered.
                    </li>
                    <li>
                      Search will work locally on your device only.
                    </li>
                    <li>
                      You&apos;ll need your passkey to access tasks on new devices.
                    </li>
                  </ul>
                  <p className="mt-2">
                    <Link
                      href="/encryption"
                      className="text-primary underline underline-offset-4"
                      target="_blank"
                    >
                      Learn more about encryption
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {!prfSupported && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive">
                  Your browser or device does not support passkey encryption.
                  Please use a browser with WebAuthn PRF support (Chrome, Edge)
                  and a compatible security key.
                </p>
              </div>
            )}

            {displayError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive">{displayError}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleEnableEncryption} disabled={!prfSupported}>
              Encrypt with Passkey
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (locked) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Unlock Your Tasks
            </DialogTitle>
            <DialogDescription>
              Your tasks are encrypted. Use your passkey to unlock them.
            </DialogDescription>
          </DialogHeader>

          {displayError && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive">{displayError}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleUnlock}>Unlock with Passkey</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldOff className="h-5 w-5" />
            Disable Encryption
          </DialogTitle>
          <DialogDescription>
            Your tasks are currently encrypted. Disabling encryption will decrypt
            all your tasks and store them in plain text on our servers.{" "}
            <Link
              href="/encryption"
              className="text-primary underline underline-offset-4"
              target="_blank"
            >
              Learn more
            </Link>
          </DialogDescription>
        </DialogHeader>

        {displayError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive">{displayError}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep Encrypted
          </Button>
          <Button variant="destructive" onClick={handleDisableEncryption}>
            Disable Encryption
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
