import { Button } from "@/components/button";
import { EmptyState, StatusMessage } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { listContacts, type ContactSummary } from "@/lib/outreach";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

type OutreachPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function OutreachPage({ searchParams }: OutreachPageProps) {
  const { userId } = await auth.protect();
  const { error } = await searchParams;

  let contacts: ContactSummary[] = [];
  let loadError: string | null = null;

  try {
    contacts = await listContacts(userId);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load contacts.";
  }

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Outreach"
        title="Your network"
        titleId="outreach-heading"
        description="Track people you want to stay in touch with and draft outreach emails."
        actions={
          <>
            <Button href="/dashboard" variant="secondary">
              Dashboard
            </Button>
            <Button href="/outreach/new" variant="primary">
              New contact
            </Button>
          </>
        }
      />

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}

      {loadError ? (
        <EmptyState title="Could not load contacts" error={loadError}>
          <Button href="/outreach" variant="secondary">
            Try again
          </Button>
        </EmptyState>
      ) : contacts.length === 0 ? (
        <EmptyState
          title="No contacts yet"
          description="Add someone you want to reach out to. Peer matching stays out of scope."
        >
          <Button href="/outreach/new" variant="primary">
            Add contact
          </Button>
        </EmptyState>
      ) : (
        <ul className="notes-list">
          {contacts.map((contact) => (
            <li key={contact.id}>
              <Link className="note-list-item" href={`/outreach/${contact.id}`}>
                <span className="note-list-title">{contact.name}</span>
                <span className="muted">
                  {[contact.role, contact.company].filter(Boolean).join(" · ") || "No role yet"}
                  {contact.draftCount > 0 ? ` · ${contact.draftCount} draft${contact.draftCount === 1 ? "" : "s"}` : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
