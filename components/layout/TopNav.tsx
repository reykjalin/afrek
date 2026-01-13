"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

const UserButton = dynamic(
  () => import("./UserButton").then((mod) => mod.UserButton),
  {
    ssr: false,
    loading: () => <Skeleton className="h-8 w-8 rounded-full" />,
  }
);
import { useEncryption } from "@/features/crypto";
import { Button } from "@/components/ui/button";
import { EncryptionModal } from "./EncryptionModal";
import { Lock, LockOpen, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function TopNav() {
  const { enabled, locked, migrating } = useEncryption();
  const [showEncryptionModal, setShowEncryptionModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getEncryptionTooltip = () => {
    if (migrating) return "Encryption in progress...";
    if (enabled && locked) return "Tasks locked - click to unlock";
    if (enabled) return "Encryption enabled";
    return "Enable encryption";
  };

  const showLockedIcon = enabled || isHovered;

  return (
    <>
      <div className="flex items-center gap-2">
        <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEncryptionModal(true)}
                  disabled={migrating}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={cn(
                    "relative overflow-hidden transition-colors",
                    enabled && !locked && "text-green-500",
                    !enabled && isHovered && "text-green-500"
                  )}
                />
              }
            >
              {migrating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Lock
                    className={cn(
                      "h-4 w-4 absolute transition-all duration-200",
                      showLockedIcon
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-75"
                    )}
                  />
                  <LockOpen
                    className={cn(
                      "h-4 w-4 transition-all duration-200",
                      showLockedIcon
                        ? "opacity-0 scale-75"
                        : "opacity-100 scale-100"
                    )}
                  />
                  {isHovered && !migrating && (
                    <span
                      className="absolute inset-0 -translate-x-full animate-[sheen_0.5s_ease-in-out_forwards] bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </TooltipTrigger>
            <TooltipContent>{getEncryptionTooltip()}</TooltipContent>
        </Tooltip>
        <UserButton />
      </div>
      <EncryptionModal
        open={showEncryptionModal}
        onOpenChange={setShowEncryptionModal}
      />
      <style jsx global>{`
        @keyframes sheen {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
}
