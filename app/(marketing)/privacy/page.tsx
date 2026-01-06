import Link from "next/link";
import { Prose } from "@/components/ui/prose";

export const metadata = {
  title: "Privacy Policy - Afrek",
  description: "How Afrek collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Last updated: January 2025
      </p>

      <Prose>
        <p className="lead">
          We collect only what we need to run Afrek and improve it. We never
          sell your data.
        </p>

        <h2>Who we are</h2>
        <p>
          Afrek is a task management application. This privacy policy applies to
          the web application at afrek.app.
        </p>

        <h2>Information we collect</h2>

        <h3>Account data</h3>
        <p>
          When you sign up, we collect your email address and name through our
          authentication provider, Clerk. This information is used to identify
          your account and communicate with you about your subscription.
        </p>

        <h3>Task data</h3>
        <p>
          We store the tasks you create, including titles, notes, tags,
          statuses, priorities, and dates. If you enable client-side encryption,
          your task titles, notes, and tags are encrypted in your browser before
          being sent to our servers—we cannot read this encrypted content.
        </p>

        <h3>Subscription and billing data</h3>
        <p>
          Payment processing is handled by Stripe through Clerk. We do not store
          your full credit card number. We receive information about your
          subscription status to provide you with the correct level of service.
        </p>

        <h3>Analytics data</h3>
        <p>
          We use PostHog to collect anonymized usage data such as page views and
          feature usage. We never log the content of your tasks in analytics.
          This helps us understand how people use Afrek so we can improve it.
        </p>

        <h3>Device and log data</h3>
        <p>
          Our servers automatically collect standard information like IP
          addresses, browser type, and timestamps for security and debugging
          purposes.
        </p>

        <h2>Client-side encryption</h2>
        <p>
          Afrek offers optional end-to-end encryption for your task content. When
          enabled:
        </p>
        <ul>
          <li>
            <strong>Encrypted:</strong> Task titles, notes, and tags
          </li>
          <li>
            <strong>Not encrypted:</strong> Task status, priority, scheduled
            date, and timestamps (so the server can filter and sort your tasks)
          </li>
        </ul>
        <p>
          Your encryption key is derived from a passkey using the WebAuthn PRF
          extension. We never have access to your encryption key or decrypted
          content.
        </p>
        <p>
          <strong>Important:</strong> If you lose access to your passkey, your
          encrypted data cannot be recovered—by you or by us.
        </p>
        <p>
          <Link href="/help/encryption" className="text-primary hover:underline">
            Learn more about how encryption works →
          </Link>
        </p>

        <h2>How we use your information</h2>
        <ul>
          <li>To provide the service (authentication, storing tasks, syncing data)</li>
          <li>To process payments and manage subscriptions</li>
          <li>To understand feature usage and improve Afrek (analytics)</li>
          <li>To communicate with you about account-related notices and important updates</li>
        </ul>

        <h2>Sharing of information</h2>
        <p>We use the following third-party services to operate Afrek:</p>
        <ul>
          <li>
            <strong>Clerk</strong> — Authentication and billing
          </li>
          <li>
            <strong>Convex</strong> — Database and real-time sync
          </li>
          <li>
            <strong>PostHog</strong> — Analytics
          </li>
          <li>
            <strong>Stripe</strong> — Payment processing (via Clerk)
          </li>
        </ul>
        <p>
          We do not sell your data. We may disclose information if required by
          law or to protect against fraud or abuse.
        </p>

        <h2>Data retention</h2>
        <ul>
          <li>
            <strong>Active accounts:</strong> Your data is retained as long as
            your account is active.
          </li>
          <li>
            <strong>Deleted tasks:</strong> When you delete a task, it is
            permanently removed from our database.
          </li>
          <li>
            <strong>Account deletion:</strong> If you delete your account or
            request deletion, all your data will be permanently removed.
          </li>
        </ul>

        <h2>Your rights</h2>
        <p>You can:</p>
        <ul>
          <li>Access, update, and delete your tasks through the app</li>
          <li>Request deletion of your account by contacting us</li>
          <li>Export your data (feature coming soon)</li>
        </ul>

        <h2>International users</h2>
        <p>
          If you are located in the EU, UK, or other regions with data
          protection laws, we process your data based on the contract we have
          with you (to provide the service) and our legitimate interests (to
          improve the service). You have rights under applicable data protection
          laws, including the right to access, correct, or delete your data.
        </p>

        <h2>Security</h2>
        <p>
          We take security seriously. All data is transmitted over HTTPS. Our
          infrastructure uses encryption at rest. Access to production systems
          is strictly controlled. Optional client-side encryption provides an
          additional layer of protection for your task content.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. We will notify you of
          significant changes by updating the date at the top of this page. For
          major changes, we may also notify you via email.
        </p>

        <h2>Open source</h2>
        <p>
          Afrek is open source. You can review how we handle your data by
          viewing the{" "}
          <a
            href="https://github.com/reykjalin/afrek"
            target="_blank"
            rel="noreferrer"
          >
            source code on GitHub
          </a>
          .
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about this privacy policy or your data, please
          contact us at{" "}
          <a href="mailto:privacy@afrek.app">privacy@afrek.app</a>.
        </p>
      </Prose>
    </div>
  );
}
