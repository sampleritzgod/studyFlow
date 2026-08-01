import { Button } from "@/components/button";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-static";

export default function PrivacyPage() {
  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Legal"
        title="Privacy policy"
        titleId="privacy-heading"
        description="How StudyFlow handles account and study data."
        actions={
          <Button href="/terms" variant="secondary">
            Terms
          </Button>
        }
      />

      <article className="legal-copy">
        <p className="muted">Last updated: 1 August 2026</p>
        <h2>What we store</h2>
        <p>
          StudyFlow stores the account identity provided by Clerk (such as user id and email) and the
          content you create in the app — notes, focus sessions, portfolio milestones, and outreach
          contacts/drafts — in a managed Postgres database (Neon).
        </p>
        <h2>How we use it</h2>
        <p>
          Data is used only to provide the product to you. We do not sell personal data. Peer matching
          is not enabled; contacts you save are for your own outreach only.
        </p>
        <h2>Processors</h2>
        <ul className="plan-list">
          <li>Clerk — authentication</li>
          <li>Neon — database</li>
          <li>Vercel — hosting</li>
        </ul>
        <h2>Retention and deletion</h2>
        <p>
          You can delete notes, sessions, milestones, and contacts inside the app. To delete your
          account entirely, contact the project owner so Clerk and database records can be removed.
        </p>
        <h2>Contact</h2>
        <p>Questions about this policy: use the email on your StudyFlow account profile.</p>
      </article>
    </main>
  );
}
