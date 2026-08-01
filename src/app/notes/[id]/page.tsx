import {
  deleteNoteAction,
  linkNoteAction,
  unlinkNoteAction,
  updateNoteAction,
} from "@/app/notes/actions";
import { Button } from "@/components/button";
import { EmptyState, StatusMessage } from "@/components/empty-state";
import { Field } from "@/components/field";
import { NoteEditorForm } from "@/components/note-editor-form";
import { PageHeader } from "@/components/page-header";
import { getNote, listNotes, type NoteDetail, type NoteSummary } from "@/lib/notes";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type NotePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; linked?: string }>;
};

export default async function NoteDetailPage({ params, searchParams }: NotePageProps) {
  const { userId } = await auth.protect();
  const { id } = await params;
  const { error, saved, linked } = await searchParams;

  let note: NoteDetail | null = null;
  let allNotes: NoteSummary[] = [];
  let loadError: string | null = null;

  try {
    [note, allNotes] = await Promise.all([getNote(userId, id), listNotes(userId)]);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load note.";
  }

  if (loadError) {
    return (
      <main className="site-shell">
        <EmptyState title="Could not load note" error={loadError}>
          <Button href="/notes" variant="secondary">
            Back to notes
          </Button>
        </EmptyState>
      </main>
    );
  }

  if (!note) notFound();

  const linkable = allNotes.filter(
    (candidate) =>
      candidate.id !== note.id &&
      !note.linkedNotes.some((linkedNote) => linkedNote.id === candidate.id),
  );

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Notes"
        title={note.title}
        titleId="note-heading"
        description="Edit content, manage links, or remove this note."
        actions={
          <>
            <Button href="/notes" variant="secondary">
              All notes
            </Button>
            <Button href="/notes/graph" variant="secondary">
              Graph
            </Button>
          </>
        }
      />

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {saved ? <StatusMessage tone="success">Saved.</StatusMessage> : null}
      {linked ? <StatusMessage tone="success">Link added.</StatusMessage> : null}

      <NoteEditorForm
        action={updateNoteAction}
        formKey={`${note.id}-${note.updatedAt.toISOString()}`}
        noteId={note.id}
        title={note.title}
        content={note.content}
        submitLabel="Save"
      />

      <section className="note-links" aria-labelledby="links-heading">
        <h2 id="links-heading">Linked notes</h2>
        {note.linkedNotes.length === 0 ? (
          <p className="muted">No links yet. Connect this note to another one below.</p>
        ) : (
          <ul className="link-list">
            {note.linkedNotes.map((linkedNote) => (
              <li key={linkedNote.id} className="link-row">
                <Link href={`/notes/${linkedNote.id}`}>{linkedNote.title}</Link>
                <form action={unlinkNoteAction}>
                  <input type="hidden" name="noteId" value={note.id} />
                  <input type="hidden" name="targetId" value={linkedNote.id} />
                  <Button type="submit" variant="secondary" size="sm">
                    Unlink
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}

        {linkable.length === 0 ? (
          <p className="muted">Create another note to add a link.</p>
        ) : (
          <form className="link-form" action={linkNoteAction}>
            <input type="hidden" name="noteId" value={note.id} />
            <Field label="Link to" name="targetId" as="select" required defaultValue="">
              <option value="" disabled>
                Choose a note
              </option>
              {linkable.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.title}
                </option>
              ))}
            </Field>
            <Button type="submit" variant="secondary">
              Add link
            </Button>
          </form>
        )}
      </section>

      <section className="danger-zone" aria-labelledby="delete-heading">
        <h2 id="delete-heading">Delete</h2>
        <p className="muted">This permanently removes the note and its links.</p>
        <form action={deleteNoteAction}>
          <input type="hidden" name="noteId" value={note.id} />
          <Button type="submit" variant="danger">
            Delete note
          </Button>
        </form>
      </section>
    </main>
  );
}
