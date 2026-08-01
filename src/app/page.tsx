import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <main className="site-shell">
      <section className="hero-grid" aria-labelledby="home-heading">
        <div className="hero-copy">
          <p className="eyebrow">StudyFlow</p>
          <h1 id="home-heading">Study with clarity</h1>
          <p className="lede">
            One calm workspace for notes, deep focus, career milestones, and thoughtful outreach.
          </p>

          <div className="action-row" aria-label="Get started">
            {userId ? (
              <>
                <Link className="button button-primary" href="/dashboard">
                  Open workspace
                </Link>
                <Link className="button button-secondary" href="/notes">
                  Jump to notes
                </Link>
              </>
            ) : (
              <>
                <Link className="button button-primary" href="/sign-up">
                  Create account
                </Link>
                <Link className="button button-secondary" href="/sign-in">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="status-panel" aria-label="What you can do">
          <div className="status-row">
            <span className="status-dot status-dot-ok" aria-hidden="true" />
            <span>Notes with links and a simple graph</span>
          </div>
          <div className="status-row">
            <span className="status-dot status-dot-ok" aria-hidden="true" />
            <span>Focus sessions with a weekly scorecard</span>
          </div>
          <div className="status-row">
            <span className="status-dot status-dot-ok" aria-hidden="true" />
            <span>Portfolio milestones and outreach contacts</span>
          </div>
        </div>
      </section>
    </main>
  );
}
