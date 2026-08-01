import Link from "next/link";
import { Button } from "@/components/button";
import { EmptyState, StatusMessage } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { auth } from "@clerk/nextjs/server";
import { listNotes, type NoteSummary } from "@/lib/notes";

export const dynamic = "force-dynamic";

type NotesPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { userId } = await auth.protect();
  const { error } = await searchParams;

  let notes: NoteSummary[] = [];
  let loadError: string | null = null;

  try {
    notes = await listNotes(userId);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load notes.";
  }

  const formatDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Notes"
        title="Your notes"
        titleId="notes-heading"
        description="Capture ideas, then link them so related thoughts stay connected."
        actions={
          <>
            <Button href="/notes/graph" variant="secondary">
              Graph
            </Button>
            <Button href="/notes/new" variant="primary">
              New note
            </Button>
          </>
        }
      />

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}

      {loadError ? (
        <EmptyState title="Could not load notes" error={loadError}>
          <Button href="/notes" variant="secondary">
            Try again
          </Button>
        </EmptyState>
      ) : notes.length === 0 ? (
        <EmptyState
          title="No notes yet"
          description="Create your first note to start building your knowledge graph."
        >
          <Button href="/notes/new" variant="primary">
            Create a note
          </Button>
        </EmptyState>
      ) : (
        <ul className="notes-list">
          {notes.map((note) => (
            <li key={note.id}>
              <Link className="note-list-item" href={`/notes/${note.id}`}>
                <span className="note-list-title">{note.title}</span>
                <span className="muted">Updated {formatDate.format(note.updatedAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
