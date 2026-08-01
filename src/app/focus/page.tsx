import { startBlockAction, startPomodoroAction } from "@/app/focus/actions";
import { Button } from "@/components/button";
import { EmptyState, StatusMessage } from "@/components/empty-state";
import { Field } from "@/components/field";
import { FocusTimer } from "@/components/focus-timer";
import { PageHeader } from "@/components/page-header";
import { getActiveFocusSession, getFocusScorecard, listFocusSessions, type FocusSessionSummary } from "@/lib/focus";
import { formatFocusDuration, type FocusScorecard } from "@/lib/focus-helpers";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

type FocusPageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function FocusPage({ searchParams }: FocusPageProps) {
  const { userId } = await auth.protect();
  const { error, saved } = await searchParams;

  let active: FocusSessionSummary | null = null;
  let history: FocusSessionSummary[] = [];
  let scorecard: FocusScorecard = {
    completedCount: 0,
    abandonedCount: 0,
    totalFocusMinutes: 0,
    completionRate: 0,
  };
  let loadError: string | null = null;

  try {
    [active, history, scorecard] = await Promise.all([
      getActiveFocusSession(userId),
      listFocusSessions(userId),
      getFocusScorecard(userId),
    ]);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load focus data.";
  }

  const formatDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Focus"
        title="Deep work"
        titleId="focus-heading"
        description="Run a Pomodoro or a timed block, then review what you actually finished."
      />

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {saved ? <StatusMessage tone="success">Session saved.</StatusMessage> : null}

      {loadError ? (
        <EmptyState title="Could not load focus" error={loadError}>
          <Button href="/focus" variant="secondary">
            Try again
          </Button>
        </EmptyState>
      ) : (
        <>
          <section className="scorecard-grid" aria-label="Focus scorecard (last 7 days)">
            <article className="card">
              <h2>Completed</h2>
              <p className="card-value">{scorecard.completedCount}</p>
              <p className="muted">Finished sessions this week</p>
            </article>
            <article className="card">
              <h2>Focus time</h2>
              <p className="card-value">{formatFocusDuration(scorecard.totalFocusMinutes)}</p>
              <p className="muted">From completed sessions</p>
            </article>
            <article className="card">
              <h2>Completion</h2>
              <p className="card-value">{scorecard.completionRate}%</p>
              <p className="muted">
                {scorecard.abandonedCount} abandoned · last 7 days
              </p>
            </article>
          </section>

          {active ? (
            <FocusTimer
              sessionId={active.id}
              plannedMinutes={active.plannedMinutes}
              startedAtIso={active.startedAt.toISOString()}
              label={active.label || active.kind}
            />
          ) : (
            <section className="focus-start" aria-label="Start a focus session">
              <form action={startPomodoroAction}>
                <Button type="submit" variant="primary">
                  Start 25m Pomodoro
                </Button>
              </form>

              <form className="note-form" action={startBlockAction}>
                <h2>Time block</h2>
                <Field label="Label" name="label" placeholder="Essay draft" />
                <Field
                  label="Minutes"
                  name="plannedMinutes"
                  type="number"
                  min={5}
                  max={240}
                  defaultValue={60}
                  required
                />
                <Button type="submit" variant="secondary">
                  Start block
                </Button>
              </form>
            </section>
          )}

          <section className="note-links" aria-labelledby="history-heading">
            <h2 id="history-heading">Session history</h2>
            {history.length === 0 ? (
              <EmptyState
                title="No sessions yet"
                description="Start a Pomodoro or time block to build your focus history."
              />
            ) : (
              <ul className="notes-list">
                {history.map((session) => (
                  <li key={session.id} className="note-list-item">
                    <span className="note-list-title">
                      {session.label || session.kind} · {session.plannedMinutes}m
                    </span>
                    <span className="muted">
                      {session.status.toLowerCase()} · {formatDate.format(session.startedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
