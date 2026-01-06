import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Prose } from "@/components/ui/prose";
import { cn } from "@/lib/utils";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function EncryptionHelpPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-8 -ml-2",
        )}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="h-8 w-8" />
        <h1 className="text-3xl font-bold tracking-tight">
          End-to-End Encryption
        </h1>
      </div>

      <Prose>
        <p className="lead">
          Afrek offers optional client-side encryption so your task data remains
          private &mdash; even from us.
        </p>

        <h2>How it works</h2>
        <p>
          When you enable encryption, your tasks are encrypted in your browser
          before being sent to our servers. The server only ever sees encrypted
          data; decryption happens entirely on your device.
        </p>
        <p>
          Your encryption key is derived from a passkey (hardware security key
          or platform authenticator) using the{" "}
          <strong>WebAuthn PRF extension</strong>. This means the key never
          leaves your authenticator and is never transmitted over the network.
        </p>

        <h2>What gets encrypted</h2>
        <ul>
          <li>Task titles</li>
          <li>Task notes</li>
          <li>Tags</li>
        </ul>

        <h2>What stays unencrypted</h2>
        <p>
          Some fields remain unencrypted so the server can filter and sort your
          tasks:
        </p>
        <ul>
          <li>Task status</li>
          <li>Priority level</li>
          <li>Scheduled date</li>
          <li>Timestamps for when a task was created, updated, or completed</li>
        </ul>

        <h2>Benefits</h2>
        <ul>
          <li>
            <strong>True privacy:</strong> Your task content is unreadable on
            our servers
          </li>
          <li>
            <strong>No password to remember:</strong> Your passkey handles
            authorization
          </li>
          <li>
            <strong>Protection against breaches:</strong> Even if our database
            were compromised, your encrypted data would be useless without your
            passkey
          </li>
        </ul>

        <h2>Trade-offs</h2>
        <ul>
          <li>
            <strong>Passkey required:</strong> You need your passkey to access
            tasks on any device
          </li>
          <li>
            <strong>Local search only:</strong> Since the server can&apos;t read
            your content, search happens on your device after decryption. This
            will make searching slower.
          </li>
          <li>
            <strong>No recovery:</strong> If you lose access to your passkey,
            your encrypted data cannot be recovered—by you or by us
          </li>
        </ul>

        <h2>Technical details</h2>
        <p>
          Encryption uses standard browser APIs (
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto"
            target="_blank"
            rel="noopener noreferrer"
          >
            Web Crypto API
          </a>
          ) with the following algorithms:
        </p>
        <ul>
          <li>
            <strong>Cipher:</strong> AES-256-GCM (authenticated encryption)
          </li>
          <li>
            <strong>Key derivation:</strong> WebAuthn PRF extension
          </li>
          <li>
            <strong>IV:</strong> 96-bit random nonce per encryption operation
          </li>
        </ul>
        <p>
          Each task&apos;s sensitive fields are JSON-serialized, encrypted, and
          stored as a base64-encoded blob. The encryption version is stored
          alongside the ciphertext to allow future algorithm upgrades.
        </p>
        <p>
          The implementation will be open-sourced, so you can audit the code
          yourself.
        </p>
      </Prose>
    </div>
  );
}
