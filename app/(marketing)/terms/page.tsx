import { Prose } from "@/components/ui/prose";

export const metadata = {
  title: "Terms of Service - Afrek",
  description: "Terms and conditions for using Afrek.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Last updated: January 2025
      </p>

      <Prose>
        <p className="lead">
          By using Afrek, you agree to these terms. Please read them carefully.
        </p>

        <h2>Acceptance of terms</h2>
        <p>
          By accessing or using Afrek, you agree to be bound by these Terms of
          Service. If you do not agree to these terms, do not use the service.
        </p>

        <h2>Eligibility and accounts</h2>
        <p>
          You must be at least 16 years old to use Afrek. You are responsible
          for maintaining the security of your account and for all activities
          that occur under your account. Do not share your account credentials
          with others.
        </p>

        <h2>Subscriptions and payments</h2>
        <h3>Pricing</h3>
        <p>
          Afrek is available for <strong>$3 per month</strong> or{" "}
          <strong>$30 per year</strong>.
        </p>

        <h3>Renewal</h3>
        <p>
          Subscriptions automatically renew at the end of each billing period
          unless you cancel before the renewal date.
        </p>

        <h3>Cancellation</h3>
        <p>
          You can cancel your subscription at any time through the app settings
          or by contacting us. Upon cancellation, you will retain access until
          the end of your current billing period.
        </p>

        <h3>Refunds</h3>
        <p>
          We do not offer refunds for partial subscription periods. If you
          believe you were charged in error, please contact us.
        </p>

        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use Afrek for any illegal or unauthorized purpose</li>
          <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
          <li>Use Afrek to store or transmit malware or malicious content</li>
          <li>Interfere with or disrupt the service or servers</li>
          <li>Reverse engineer, decompile, or attempt to extract the source code</li>
          <li>Use the service to harass, abuse, or harm others</li>
        </ul>

        <h2>Content and data</h2>
        <h3>Your content</h3>
        <p>
          You retain ownership of all content you create in Afrek, including
          tasks, notes, and tags. We do not claim any ownership rights over your
          content.
        </p>

        <h3>License to us</h3>
        <p>
          By using Afrek, you grant us a limited license to process and store
          your content solely to provide the service. If you enable client-side
          encryption, we cannot read your encrypted content.
        </p>

        <h3>Encrypted content</h3>
        <p>
          If you enable end-to-end encryption, you are solely responsible for
          maintaining access to your passkey. We cannot recover encrypted data
          if you lose your passkey.
        </p>

        <h2>Service availability</h2>
        <p>
          We strive to provide reliable service but do not guarantee 100%
          uptime. We may modify, suspend, or discontinue features with
          reasonable notice. We reserve the right to change pricing with advance
          notice to existing subscribers.
        </p>

        <h2>Disclaimers</h2>
        <p>
          Afrek is provided &quot;as is&quot; and &quot;as available&quot; without warranties
          of any kind, either express or implied. We do not warrant that the
          service will be uninterrupted, secure, or error-free.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, we shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages, or
          any loss of profits or revenues. Our total liability shall not exceed
          the amount you paid us in the 12 months preceding the claim.
        </p>

        <h2>Termination</h2>
        <p>We may terminate or suspend your account if you:</p>
        <ul>
          <li>Violate these terms</li>
          <li>Engage in fraudulent or abusive behavior</li>
          <li>Fail to pay for your subscription</li>
        </ul>
        <p>
          Upon termination, your right to use Afrek will immediately cease. We
          may delete your data after a reasonable period following termination.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms shall be governed by and construed in accordance with the
          laws of the jurisdiction in which Afrek operates, without regard to
          conflict of law principles.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms from time to time. We will notify you of
          significant changes by updating the date at the top of this page. Your
          continued use of Afrek after changes constitutes acceptance of the new
          terms.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about these terms, please contact us at{" "}
          <a href="mailto:legal@afrek.app">legal@afrek.app</a>.
        </p>
      </Prose>
    </div>
  );
}
