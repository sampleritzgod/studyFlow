import { createContactAction } from "@/app/outreach/actions";
import { Button } from "@/components/button";
import { StatusMessage } from "@/components/empty-state";
import { Field } from "@/components/field";
import { PageHeader } from "@/components/page-header";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

type NewContactPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewContactPage({ searchParams }: NewContactPageProps) {
  await auth.protect();
  const { error } = await searchParams;

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Outreach"
        title="New contact"
        titleId="new-contact-heading"
        description="Save the person and relationship context you’ll use for drafts."
        actions={
          <Button href="/outreach" variant="secondary">
            Back
          </Button>
        }
      />

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}

      <form className="note-form" action={createContactAction}>
        <Field label="Name" name="name" required maxLength={200} />
        <Field label="Email" name="email" type="email" maxLength={200} />
        <Field label="Company" name="company" maxLength={200} />
        <Field label="Role" name="role" maxLength={200} />
        <Field
          label="Relationship"
          name="relationship"
          hint="e.g. met at a campus talk, alumni intro"
          maxLength={300}
        />
        <Field label="Notes" name="notes" as="textarea" rows={5} />
        <div className="action-row">
          <Button type="submit" variant="primary">
            Save contact
          </Button>
          <Button href="/outreach" variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}
