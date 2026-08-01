import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createNoteAction } from "@/app/notes/actions";

export const dynamic = "force-dynamic";

type NewNotePageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewNotePage({ searchParams }: NewNotePageProps) {
  await auth.protect();
  const { error } = await searchParams;

  return (
    <main className="site-shell">
      <section className="page-header" aria-labelledby="new-note-heading">
        <div>
          <p className="eyebrow">Notes</p>
          <h1 id="new-note-heading" className="page-title">
            New note
          </h1>
          <p className="lede">Start with a title. You can link related notes after saving.</p>
        </div>
        <Link className="button button-secondary" href="/notes">
          Back to notes
        </Link>
      </section>

      {error ? (
        <p className="flash flash-error" role="alert">
          {error}
        </p>
      ) : null}

      <form className="note-form" action={createNoteAction}>
        <label className="field">
          <span className="field-label">Title</span>
          <input className="field-input" name="title" type="text" required maxLength={200} />
        </label>
        <label className="field">
          <span className="field-label">Content</span>
          <textarea className="field-textarea" name="content" rows={12} />
        </label>
        <div className="action-row">
          <button className="button button-primary" type="submit">
            Create note
          </button>
          <Link className="button button-secondary" href="/notes">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
