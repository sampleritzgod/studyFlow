import { Button } from "@/components/button";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-static";

export default function TermsPage() {
  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Legal"
        title="Terms of use"
        titleId="terms-heading"
        description="Basic terms for using StudyFlow while it is in active development."
        actions={
          <Button href="/privacy" variant="secondary">
            Privacy
          </Button>
        }
      />

      <article className="legal-copy">
        <p className="muted">Last updated: 1 August 2026</p>
        <h2>The service</h2>
        <p>
          StudyFlow is a personal productivity and learning app. Features may change while the product
          is under active development. There is no paid plan at this time.
        </p>
        <h2>Your responsibilities</h2>
        <p>
          You are responsible for the content you store and for outreach messages you send using
          drafts from the app. Do not use StudyFlow for unlawful or abusive activity.
        </p>
        <h2>Availability</h2>
        <p>
          The app is provided as-is. Hosting, auth, or database outages at Clerk, Neon, or Vercel may
          interrupt access. We aim to restore service quickly but do not guarantee uptime.
        </p>
        <h2>Accounts</h2>
        <p>
          Authentication is handled by Clerk. Keep your sign-in credentials secure. You may request
          account deletion from the project owner.
        </p>
      </article>
    </main>
  );
}
