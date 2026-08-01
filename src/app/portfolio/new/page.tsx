import { createMilestoneAction } from "@/app/portfolio/actions";
import { Button } from "@/components/button";
import { StatusMessage } from "@/components/empty-state";
import { Field } from "@/components/field";
import { PageHeader } from "@/components/page-header";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

type NewMilestonePageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewMilestonePage({ searchParams }: NewMilestonePageProps) {
  await auth.protect();
  const { error } = await searchParams;

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Portfolio"
        title="New milestone"
        titleId="new-milestone-heading"
        description="Name the goal, then add checklist items on the next screen."
        actions={
          <Button href="/portfolio" variant="secondary">
            Back
          </Button>
        }
      />

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}

      <form className="note-form" action={createMilestoneAction}>
        <Field label="Title" name="title" required maxLength={200} />
        <Field label="Description" name="description" as="textarea" rows={5} />
        <div className="action-row">
          <Button type="submit" variant="primary">
            Create milestone
          </Button>
          <Button href="/portfolio" variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}
