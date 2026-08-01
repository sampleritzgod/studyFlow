import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const label = user?.primaryEmailAddress?.emailAddress ?? user?.fullName ?? "user";

  return (
    <main className="site-shell">
      <section className="hero-grid" aria-labelledby="home-heading">
        <div className="hero-copy">
          <p className="eyebrow">Foundation phase</p>
          <h1 id="home-heading">StudyFlow</h1>
          <p className="lede">
            A focused learning workspace for turning scattered study time into clear progress.
          </p>

          {userId ? (
            <div className="action-row" aria-label="Signed in actions">
              <Link className="button button-primary" href="/dashboard">
                Go to dashboard
              </Link>
              <SignOutButton>
                <button className="button button-secondary" type="button">
                  Sign out
                </button>
              </SignOutButton>
            </div>
          ) : (
            <div className="action-row" aria-label="Account actions">
              <Link className="button button-primary" href="/sign-in">
                Sign in
              </Link>
              <Link className="button button-secondary" href="/sign-up">
                Create account
              </Link>
            </div>
          )}

          {userId ? <p className="muted">Signed in as {label}.</p> : null}
        </div>

        <div className="status-panel" aria-label="Current foundation status">
          <div className="status-row">
            <span className="status-dot status-dot-ok" aria-hidden="true" />
            <span>Clerk auth routes are wired.</span>
          </div>
          <div className="status-row">
            <span className="status-dot status-dot-ok" aria-hidden="true" />
            <span>Prisma 7 is configured for Neon.</span>
          </div>
          <div className="status-row">
            <span className="status-dot status-dot-idle" aria-hidden="true" />
            <span>Dashboard verifies the live database connection.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
