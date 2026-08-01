import { Button } from "@/components/button";
import { EmptyState, StatusMessage } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getPortfolioScore, listMilestones, type MilestoneSummary } from "@/lib/portfolio";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PortfolioPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const { userId } = await auth.protect();
  const { error } = await searchParams;

  let milestones: MilestoneSummary[] = [];
  let score = { milestoneCount: 0, totalItems: 0, doneItems: 0, percent: 0 };
  let loadError: string | null = null;

  try {
    [milestones, score] = await Promise.all([listMilestones(userId), getPortfolioScore(userId)]);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load portfolio.";
  }

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Portfolio"
        title="Career milestones"
        titleId="portfolio-heading"
        description="Track milestones and checklist progress toward your career goals."
        actions={
          <>
            <Button href="/dashboard" variant="secondary">
              Dashboard
            </Button>
            <Button href="/portfolio/new" variant="primary">
              New milestone
            </Button>
          </>
        }
      />

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}

      {loadError ? (
        <EmptyState title="Could not load portfolio" error={loadError}>
          <Button href="/portfolio" variant="secondary">
            Try again
          </Button>
        </EmptyState>
      ) : (
        <>
          <section className="scorecard-grid" aria-label="Portfolio progress">
            <article className="card">
              <h2>Milestones</h2>
              <p className="card-value">{score.milestoneCount}</p>
              <p className="muted">Active career tracks</p>
            </article>
            <article className="card">
              <h2>Checklist</h2>
              <p className="card-value">
                {score.doneItems}/{score.totalItems}
              </p>
              <p className="muted">Items completed</p>
            </article>
            <article className="card">
              <h2>Progress</h2>
              <p className="card-value">{score.percent}%</p>
              <p className="muted">Across all checklists</p>
            </article>
          </section>

          {milestones.length === 0 ? (
            <EmptyState
              title="No milestones yet"
              description="Create a milestone, then add checklist items to track progress."
            >
              <Button href="/portfolio/new" variant="primary">
                Create milestone
              </Button>
            </EmptyState>
          ) : (
            <ul className="notes-list">
              {milestones.map((milestone) => (
                <li key={milestone.id}>
                  <Link className="note-list-item" href={`/portfolio/${milestone.id}`}>
                    <span className="note-list-title">{milestone.title}</span>
                    <span className="muted">
                      {milestone.progress.done}/{milestone.progress.total} done ·{" "}
                      {milestone.progress.percent}%
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
