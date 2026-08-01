import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { checkDatabaseHealth } from "@/lib/health";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth.protect();
  const user = await currentUser();
  const label = user?.primaryEmailAddress?.emailAddress ?? user?.fullName ?? userId;
  const database = await checkDatabaseHealth();
  const checkedAt = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(database.checkedAt));

  return (
    <main className="site-shell">
      <section className="dashboard-header" aria-labelledby="dashboard-heading">
        <div>
          <p className="eyebrow">StudyFlow dashboard</p>
          <h1 id="dashboard-heading">Foundation check</h1>
          <p className="lede">
            Signed in as {label}. The project is ready for phase 0 verification against the real
            Neon database.
          </p>
        </div>

        <SignOutButton>
          <button className="button button-secondary" type="button">
            Sign out
          </button>
        </SignOutButton>
      </section>

      <section className="dashboard-grid" aria-label="Foundation status">
        <article className="card">
          <div className="card-heading">
            <span
              className={database.ok ? "status-dot status-dot-ok" : "status-dot status-dot-error"}
              aria-hidden="true"
            />
            <h2>Database</h2>
          </div>
          <p className="card-value">{database.ok ? "Connected" : "Needs attention"}</p>
          <p className="muted">
            Checked {checkedAt} in {database.latencyMs}ms.
          </p>
          {database.ok ? null : (
            <p className="error-text" role="alert">
              {database.error}
            </p>
          )}
        </article>

        <article className="card">
          <div className="card-heading">
            <span className="status-dot status-dot-ok" aria-hidden="true" />
            <h2>Authentication</h2>
          </div>
          <p className="card-value">Protected</p>
          <p className="muted">Clerk middleware and server-side auth both protect this route.</p>
        </article>

        <article className="card">
          <div className="card-heading">
            <span className="status-dot status-dot-idle" aria-hidden="true" />
            <h2>Next step</h2>
          </div>
          <p className="card-value">Outreach</p>
          <p className="muted">Track contacts and draft outreach emails for your own network.</p>
          <div className="action-row">
            <Link className="button button-primary" href="/outreach">
              Open outreach
            </Link>
            <Link className="button button-secondary" href="/portfolio">
              Portfolio
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
