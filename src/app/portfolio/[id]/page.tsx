import {
  addChecklistItemAction,
  deleteChecklistItemAction,
  deleteMilestoneAction,
  toggleChecklistItemAction,
  updateMilestoneAction,
} from "@/app/portfolio/actions";
import { Button } from "@/components/button";
import { EmptyState, StatusMessage } from "@/components/empty-state";
import { Field } from "@/components/field";
import { PageHeader } from "@/components/page-header";
import { getMilestone, type MilestoneDetail } from "@/lib/portfolio";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type MilestonePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function MilestoneDetailPage({ params, searchParams }: MilestonePageProps) {
  const { userId } = await auth.protect();
  const { id } = await params;
  const { error, saved } = await searchParams;

  let milestone: MilestoneDetail | null = null;
  let loadError: string | null = null;

  try {
    milestone = await getMilestone(userId, id);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load milestone.";
  }

  if (loadError) {
    return (
      <main className="site-shell">
        <EmptyState title="Could not load milestone" error={loadError}>
          <Button href="/portfolio" variant="secondary">
            Back to portfolio
          </Button>
        </EmptyState>
      </main>
    );
  }

  if (!milestone) notFound();

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Portfolio"
        title={milestone.title}
        titleId="milestone-heading"
        description={`${milestone.progress.done}/${milestone.progress.total} checklist items done · ${milestone.progress.percent}%`}
        actions={
          <Button href="/portfolio" variant="secondary">
            All milestones
          </Button>
        }
      />

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {saved ? <StatusMessage tone="success">Saved.</StatusMessage> : null}

      <div className="progress-bar" aria-hidden="true">
        <span className="progress-bar-fill" style={{ width: `${milestone.progress.percent}%` }} />
      </div>

      <form
        key={`${milestone.id}-${milestone.updatedAt.toISOString()}`}
        className="note-form"
        action={updateMilestoneAction}
      >
        <input type="hidden" name="milestoneId" value={milestone.id} />
        <Field
          label="Title"
          name="title"
          required
          maxLength={200}
          defaultValue={milestone.title}
        />
        <Field
          label="Description"
          name="description"
          as="textarea"
          rows={4}
          defaultValue={milestone.description}
        />
        <Button type="submit" variant="primary">
          Save milestone
        </Button>
      </form>

      <section className="note-links" aria-labelledby="checklist-heading">
        <h2 id="checklist-heading">Checklist</h2>

        {milestone.items.length === 0 ? (
          <p className="muted">No items yet. Add the first step below.</p>
        ) : (
          <ul className="checklist">
            {milestone.items.map((item) => (
              <li key={item.id} className="checklist-row">
                <form action={toggleChecklistItemAction} className="checklist-toggle">
                  <input type="hidden" name="milestoneId" value={milestone.id} />
                  <input type="hidden" name="itemId" value={item.id} />
                  <button
                    className={item.done ? "check-done" : "check-open"}
                    type="submit"
                    aria-pressed={item.done}
                    aria-label={item.done ? `Mark ${item.title} incomplete` : `Mark ${item.title} done`}
                  >
                    {item.done ? "Done" : "Todo"}
                  </button>
                  <span className={item.done ? "checklist-title done" : "checklist-title"}>
                    {item.title}
                  </span>
                </form>
                <form action={deleteChecklistItemAction}>
                  <input type="hidden" name="milestoneId" value={milestone.id} />
                  <input type="hidden" name="itemId" value={item.id} />
                  <Button type="submit" variant="secondary" size="sm">
                    Remove
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <form className="link-form" action={addChecklistItemAction}>
          <input type="hidden" name="milestoneId" value={milestone.id} />
          <Field label="New checklist item" name="title" required maxLength={200} />
          <Button type="submit" variant="secondary">
            Add item
          </Button>
        </form>
      </section>

      <section className="danger-zone" aria-labelledby="delete-milestone-heading">
        <h2 id="delete-milestone-heading">Delete</h2>
        <p className="muted">Removes this milestone and all checklist items.</p>
        <form action={deleteMilestoneAction}>
          <input type="hidden" name="milestoneId" value={milestone.id} />
          <Button type="submit" variant="danger">
            Delete milestone
          </Button>
        </form>
      </section>
    </main>
  );
}
