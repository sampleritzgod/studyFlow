import {
  deleteContactAction,
  draftEmailAction,
  updateContactAction,
} from "@/app/outreach/actions";
import { Button } from "@/components/button";
import { EmptyState, StatusMessage } from "@/components/empty-state";
import { Field } from "@/components/field";
import { PageHeader } from "@/components/page-header";
import { getContact, type ContactDetail } from "@/lib/outreach";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type ContactPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; drafted?: string }>;
};

export default async function ContactDetailPage({ params, searchParams }: ContactPageProps) {
  const { userId } = await auth.protect();
  const { id } = await params;
  const { error, saved, drafted } = await searchParams;

  let contact: ContactDetail | null = null;
  let loadError: string | null = null;

  try {
    contact = await getContact(userId, id);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load contact.";
  }

  if (loadError) {
    return (
      <main className="site-shell">
        <EmptyState title="Could not load contact" error={loadError}>
          <Button href="/outreach" variant="secondary">
            Back to outreach
          </Button>
        </EmptyState>
      </main>
    );
  }

  if (!contact) notFound();

  const formatDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Outreach"
        title={contact.name}
        titleId="contact-heading"
        description="Update relationship notes and draft an outreach email."
        actions={
          <Button href="/outreach" variant="secondary">
            All contacts
          </Button>
        }
      />

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {saved ? <StatusMessage tone="success">Saved.</StatusMessage> : null}
      {drafted ? (
        <StatusMessage tone="success">Draft created from this contact’s details.</StatusMessage>
      ) : null}

      <form
        key={`${contact.id}-${contact.updatedAt.toISOString()}`}
        className="note-form"
        action={updateContactAction}
      >
        <input type="hidden" name="contactId" value={contact.id} />
        <Field label="Name" name="name" required maxLength={200} defaultValue={contact.name} />
        <Field label="Email" name="email" type="email" maxLength={200} defaultValue={contact.email} />
        <Field label="Company" name="company" maxLength={200} defaultValue={contact.company} />
        <Field label="Role" name="role" maxLength={200} defaultValue={contact.role} />
        <Field
          label="Relationship"
          name="relationship"
          maxLength={300}
          defaultValue={contact.relationship}
        />
        <Field label="Notes" name="notes" as="textarea" rows={5} defaultValue={contact.notes} />
        <Button type="submit" variant="primary">
          Save contact
        </Button>
      </form>

      <section className="note-links" aria-labelledby="draft-heading">
        <h2 id="draft-heading">Email drafts</h2>
        <p className="muted">
          Template-based drafts for now (no external AI). Edit before you send from your own mail
          client.
        </p>
        <form action={draftEmailAction}>
          <input type="hidden" name="contactId" value={contact.id} />
          <Button type="submit" variant="secondary">
            Generate draft
          </Button>
        </form>

        {contact.drafts.length === 0 ? (
          <p className="muted">No drafts yet.</p>
        ) : (
          <ul className="draft-list">
            {contact.drafts.map((draft) => (
              <li key={draft.id} className="draft-card">
                <p className="note-list-title">{draft.subject}</p>
                <p className="muted">Created {formatDate.format(draft.createdAt)}</p>
                <pre className="draft-body">{draft.body}</pre>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="danger-zone" aria-labelledby="delete-contact-heading">
        <h2 id="delete-contact-heading">Delete</h2>
        <p className="muted">Removes this contact and all drafts.</p>
        <form action={deleteContactAction}>
          <input type="hidden" name="contactId" value={contact.id} />
          <Button type="submit" variant="danger">
            Delete contact
          </Button>
        </form>
      </section>
    </main>
  );
}
