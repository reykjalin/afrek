import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { Prose } from "@/components/ui/prose";
import { cn } from "@/lib/utils";
import { ShieldCheck, ArrowLeft, Check, X } from "lucide-react";

export const metadata = {
  title: "Security & Encryption - Afrek",
  description:
    "Learn how Afrek's optional end-to-end encryption protects your task data.",
};

export default function EncryptionHelpPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Link
        href="/help"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-8 -ml-2"
        )}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Help
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <ShieldCheck className="h-8 w-8" />
        <h1 className="text-3xl font-bold tracking-tight">
          Security & Encryption
        </h1>
      </div>

      {/* Plain language overview */}
      <div className="mb-12 rounded-lg border bg-muted/30 p-6">
        <h2 className="mb-4 text-lg font-semibold">The short version</h2>
        <p className="mb-4 text-muted-foreground">
          Afrek has two security modes:
        </p>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-3 w-3 text-primary" />
            </div>
            <div>
              <strong>Standard mode</strong> — Your data is stored securely
              using industry-standard practices. We can access it to provide
              support if needed.
            </div>
          </li>
          <li className="flex gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-3 w-3 text-primary" />
            </div>
            <div>
              <strong>End-to-end encryption</strong> — Your task content is
              encrypted in your browser before it reaches our servers. We
              cannot read your encrypted data, even if we wanted to.
            </div>
          </li>
        </ul>
      </div>

      {/* Should I enable encryption? */}
      <div className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">
          Should I enable encryption?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" />
              Consider it if:
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• You store sensitive personal or client info in tasks</li>
              <li>• You&apos;re familiar with passkeys</li>
              <li>• Privacy is a top priority for you</li>
            </ul>
          </div>
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold text-orange-600 dark:text-orange-400">
              <X className="h-4 w-4" />
              Maybe skip it if:
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• You&apos;re new to passkeys</li>
              <li>• You worry about losing access to devices</li>
              <li>• Your tasks aren&apos;t particularly sensitive</li>
            </ul>
          </div>
        </div>
      </div>

      {/* How to enable */}
      <div className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">How to enable encryption</h2>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            <span>
              Click the lock icon in the top navigation bar of the app
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              2
            </span>
            <span>Follow the prompts to register a passkey</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              3
            </span>
            <span>
              Your existing tasks will be encrypted and new tasks will be
              encrypted automatically
            </span>
          </li>
        </ol>
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">
            ⚠️ Important: If you lose access to your passkey, your encrypted
            data cannot be recovered—by you or by us. Make sure you have backup
            access to your passkey.
          </p>
        </div>
      </div>

      {/* Detailed content */}
      <Prose>
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
          <li>Task status (backlog, scheduled, done)</li>
          <li>Priority level</li>
          <li>Scheduled date</li>
          <li>Timestamps (created, updated, completed)</li>
        </ul>

        <h2>Benefits</h2>
        <ul>
          <li>
            <strong>True privacy:</strong> Your task content is unreadable on
            our servers
          </li>
          <li>
            <strong>No password to remember:</strong> Your passkey handles
            authentication and key derivation
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
            your content, search happens on your device after decryption, which
            may be slower
          </li>
          <li>
            <strong>No recovery:</strong> If you lose access to your passkey,
            your encrypted data cannot be recovered
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
          The implementation is open source, so you can{" "}
          <a
            href="https://github.com/reykjalin/afrek"
            target="_blank"
            rel="noreferrer"
          >
            audit the code yourself on GitHub
          </a>
          .
        </p>
      </Prose>
    </div>
  );
}
