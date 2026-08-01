import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/page-header";
import { checkDatabaseHealth } from "@/lib/health";

export const dynamic = "force-dynamic";

const areas = [
  {
    href: "/notes",
    title: "Notes",
    body: "Capture ideas and link related thoughts.",
  },
  {
    href: "/focus",
    title: "Focus",
    body: "Run Pomodoros and review your scorecard.",
  },
  {
    href: "/portfolio",
    title: "Portfolio",
    body: "Track career milestones and checklists.",
  },
  {
    href: "/outreach",
    title: "Outreach",
    body: "Keep contacts and draft outreach emails.",
  },
] as const;

export default async function DashboardPage() {
  await auth.protect();
  const user = await currentUser();
  const label = user?.firstName ?? user?.primaryEmailAddress?.emailAddress ?? "there";
  const database = await checkDatabaseHealth();

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Workspace"
        title={`Welcome back, ${label}`}
        titleId="dashboard-heading"
        description="Pick up where you left off. Your notes, focus sessions, portfolio, and outreach live here."
      />

      {!database.ok ? (
        <p className="flash flash-error" role="alert">
          Database needs attention: {database.error}
        </p>
      ) : null}

      <section className="hub-grid" aria-label="StudyFlow areas">
        {areas.map((area) => (
          <Link key={area.href} className="hub-card" href={area.href}>
            <h2>{area.title}</h2>
            <p className="muted">{area.body}</p>
            <span className="hub-card-cta">Open</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
