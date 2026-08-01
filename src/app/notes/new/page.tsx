import { createNoteAction } from "@/app/notes/actions";
import { Button } from "@/components/button";
import { StatusMessage } from "@/components/empty-state";
import { NoteEditorForm } from "@/components/note-editor-form";
import { PageHeader } from "@/components/page-header";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

type NewNotePageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewNotePage({ searchParams }: NewNotePageProps) {
  await auth.protect();
  const { error } = await searchParams;

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Notes"
        title="New note"
        titleId="new-note-heading"
        description="Start with a title. You can link related notes after saving."
        actions={
          <Button href="/notes" variant="secondary">
            Back to notes
          </Button>
        }
      />

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}

      <NoteEditorForm
        action={createNoteAction}
        submitLabel="Create note"
        cancelHref="/notes"
      />
    </main>
  );
}
