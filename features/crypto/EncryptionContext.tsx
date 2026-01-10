"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  registerPasskeyWithPrf,
  authenticatePasskeyWithPrf,
  createKeyCheck,
  verifyKeyCheck,
  encryptJson,
  decryptJson,
  isPrfSupported,
  type EncryptedBlob,
  type EncryptedTaskPayload,
} from "@/lib/crypto";

interface EncryptionContextType {
  enabled: boolean;
  locked: boolean;
  migrating: boolean;
  key: CryptoKey | null;
  prfSupported: boolean;
  error: string | null;
  enableEncryption: () => Promise<void>;
  disableEncryption: () => Promise<void>;
  unlock: () => Promise<void>;
}

const EncryptionContext = createContext<EncryptionContextType | null>(null);

export function EncryptionProvider({ children }: { children: ReactNode }) {
  const user = useQuery(api.users.current);
  const setEncryption = useMutation(api.users.setEncryption);
  const clearEncryption = useMutation(api.users.clearEncryption);
  const updateTask = useMutation(api.tasks.updateTask);

  const [key, setKey] = useState<CryptoKey | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prfSupported, setPrfSupported] = useState(false);

  useEffect(() => {
    setPrfSupported(isPrfSupported());
  }, []);

  const enabled = !!user?.encryption;
  const locked = enabled && !key;

  const getAllTasks = useQuery(
    api.tasks.listTasks,
    user ? { userId: user.externalId } : "skip"
  );

  const encryptAllTasks = useCallback(
    async (newKey: CryptoKey) => {
      if (getAllTasks && getAllTasks.length > 0) {
        for (const task of getAllTasks) {
          if (!task.encryptedPayload) {
            const payload: EncryptedTaskPayload = {
              titleJson: task.titleJson ?? "",
              notesJson: task.notesJson,
              tags: task.tags,
            };
            const blob = await encryptJson(newKey, payload);
            await updateTask({
              id: task._id,
              titleJson: "",
              notesJson: "",
              tags: [],
              encryptedPayload: JSON.stringify(blob),
            });
          }
        }
      }
    },
    [getAllTasks, updateTask]
  );

  const enableEncryption = useCallback(async () => {
    if (!user || migrating) return;
    setError(null);
    setMigrating(true);

    try {
      const { credentialId, key: newKey } = await registerPasskeyWithPrf(
        user.externalId
      );

      const keyCheck = await createKeyCheck(newKey);
      await setEncryption({ credentialId, keyCheck });
      await encryptAllTasks(newKey);
      setKey(newKey);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      throw e;
    } finally {
      setMigrating(false);
    }
  }, [user, migrating, setEncryption, encryptAllTasks]);

  const disableEncryption = useCallback(async () => {
    if (!user?.encryption || !key || migrating) return;
    setError(null);
    setMigrating(true);

    try {
      if (getAllTasks && getAllTasks.length > 0) {
        for (const task of getAllTasks) {
          if (task.encryptedPayload) {
            const blob: EncryptedBlob = JSON.parse(task.encryptedPayload);
            const decrypted = await decryptJson<EncryptedTaskPayload>(key, blob);
            await updateTask({
              id: task._id,
              titleJson: decrypted.titleJson,
              notesJson: decrypted.notesJson,
              tags: decrypted.tags,
              encryptedPayload: null,
            });
          }
        }
      }

      await clearEncryption();
      setKey(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      throw e;
    } finally {
      setMigrating(false);
    }
  }, [user, key, migrating, getAllTasks, clearEncryption, updateTask]);

  const unlock = useCallback(async () => {
    if (!user?.encryption || key || migrating) return;
    setError(null);

    try {
      const { key: derivedKey } = await authenticatePasskeyWithPrf(
        user.encryption.credentialId
      );

      const isValid = await verifyKeyCheck(derivedKey, user.encryption.keyCheck);
      if (!isValid) {
        throw new Error("Key verification failed. Please try again.");
      }

      setKey(derivedKey);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      throw e;
    }
  }, [user, key, migrating]);

  return (
    <EncryptionContext.Provider
      value={{
        enabled,
        locked,
        migrating,
        key,
        prfSupported,
        error,
        enableEncryption,
        disableEncryption,
        unlock,
      }}
    >
      {children}
    </EncryptionContext.Provider>
  );
}

export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error("useEncryption must be used within EncryptionProvider");
  }
  return context;
}
