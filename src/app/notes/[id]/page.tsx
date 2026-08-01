import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  deleteNoteAction,
  linkNoteAction,
  unlinkNoteAction,
  updateNoteAction,
} from "@/app/notes/actions";
import { getNote, listNotes, type NoteDetail, type NoteSummary } from "@/lib/notes";

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
        <section className="empty-state" aria-live="polite">
          <h1>Could not load note</h1>
          <p className="error-text" role="alert">
            {loadError}
          </p>
          <Link className="button button-secondary" href="/notes">
            Back to notes
          </Link>
        </section>
      </main>
    );
  }

  if (!note) notFound();

  const linkable = allNotes.filter(
    (candidate) =>
      candidate.id !== note.id &&
      !note.linkedNotes.some((linkedNote: NoteSummary) => linkedNote.id === candidate.id),
  );

  return (
    <main className="site-shell">
      <section className="page-header" aria-labelledby="note-heading">
        <div>
          <p className="eyebrow">Notes</p>
          <h1 id="note-heading" className="page-title">
            {note.title}
          </h1>
          <p className="lede">Edit content, manage links, or remove this note.</p>
        </div>
        <div className="action-row">
          <Link className="button button-secondary" href="/notes">
            All notes
          </Link>
          <Link className="button button-secondary" href="/notes/graph">
            Graph
          </Link>
        </div>
      </section>

      {error ? (
        <p className="flash flash-error" role="alert">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="flash flash-success" role="status">
          Saved.
        </p>
      ) : null}
      {linked ? (
        <p className="flash flash-success" role="status">
          Link added.
        </p>
      ) : null}

      <form
        key={`${note.id}-${note.updatedAt.toISOString()}`}
        className="note-form"
        action={updateNoteAction}
      >
        <input type="hidden" name="noteId" value={note.id} />
        <label className="field">
          <span className="field-label">Title</span>
          <input
            className="field-input"
            name="title"
            type="text"
            required
            maxLength={200}
            defaultValue={note.title}
          />
        </label>
        <label className="field">
          <span className="field-label">Content</span>
          <textarea
            className="field-textarea"
            name="content"
            rows={14}
            defaultValue={note.content}
          />
        </label>
        <div className="action-row">
          <button className="button button-primary" type="submit">
            Save
          </button>
        </div>
      </form>

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
                  <button className="button button-secondary button-compact" type="submit">
                    Unlink
                  </button>
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
            <label className="field">
              <span className="field-label">Link to</span>
              <select className="field-input" name="targetId" required defaultValue="">
                <option value="" disabled>
                  Choose a note
                </option>
                {linkable.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.title}
                  </option>
                ))}
              </select>
            </label>
            <button className="button button-secondary" type="submit">
              Add link
            </button>
          </form>
        )}
      </section>

      <section className="danger-zone" aria-labelledby="delete-heading">
        <h2 id="delete-heading">Delete</h2>
        <p className="muted">This permanently removes the note and its links.</p>
        <form action={deleteNoteAction}>
          <input type="hidden" name="noteId" value={note.id} />
          <button className="button button-danger" type="submit">
            Delete note
          </button>
        </form>
      </section>
    </main>
  );
}
