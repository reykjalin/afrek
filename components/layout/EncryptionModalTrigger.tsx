"use client";

import { useState, useEffect, useRef } from "react";
import { useCommandBar } from "@/features/command-bar";
import { useEncryption } from "@/features/crypto";
import { EncryptionModal } from "./EncryptionModal";

export function EncryptionModalTrigger() {
  const { encryptionModalRequested, clearEncryptionModalRequest } = useCommandBar();
  const { enabled, locked } = useEncryption();
  const [open, setOpen] = useState(false);
  const hasPromptedUnlock = useRef(false);

  useEffect(() => {
    if (encryptionModalRequested) {
      setOpen(true);
      clearEncryptionModalRequest();
    }
  }, [encryptionModalRequested, clearEncryptionModalRequest]);

  useEffect(() => {
    if (enabled && locked && !hasPromptedUnlock.current) {
      hasPromptedUnlock.current = true;
      setOpen(true);
    }
  }, [enabled, locked]);

  return <EncryptionModal open={open} onOpenChange={setOpen} />;
}
