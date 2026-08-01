import Link from "next/link";
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
      <section className="dashboard-header" aria-labelledby="notes-heading">
        <div>
          <p className="eyebrow">Notes</p>
          <h1 id="notes-heading">Your notes</h1>
          <p className="lede">Capture ideas, then link them so related thoughts stay connected.</p>
        </div>
        <div className="action-row">
          <Link className="button button-secondary" href="/dashboard">
            Dashboard
          </Link>
          <Link className="button button-secondary" href="/notes/graph">
            Graph
          </Link>
          <Link className="button button-primary" href="/notes/new">
            New note
          </Link>
        </div>
      </section>

      {error ? (
        <p className="error-text" role="alert">
          {error}
        </p>
      ) : null}

      {loadError ? (
        <section className="empty-state" aria-live="polite">
          <h2>Could not load notes</h2>
          <p className="error-text" role="alert">
            {loadError}
          </p>
          <Link className="button button-secondary" href="/notes">
            Try again
          </Link>
        </section>
      ) : notes.length === 0 ? (
        <section className="empty-state" aria-live="polite">
          <h2>No notes yet</h2>
          <p className="muted">Create your first note to start building your knowledge graph.</p>
          <Link className="button button-primary" href="/notes/new">
            Create a note
          </Link>
        </section>
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
