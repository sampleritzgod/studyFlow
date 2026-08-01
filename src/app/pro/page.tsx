import { Button } from "@/components/button";
import { StatusMessage } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getUserPlan } from "@/lib/billing";
import { requirePro } from "@/lib/plan-gate";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

type ProPageProps = {
  searchParams: Promise<{ checkout?: string }>;
};

export default async function ProPage({ searchParams }: ProPageProps) {
  const { userId } = await auth.protect();
  await requirePro(userId);
  const plan = await getUserPlan(userId);
  const { checkout } = await searchParams;

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Pro"
        title="Pro workspace"
        titleId="pro-heading"
        description="This surface is plan-gated. Notes and Focus remain free for every account."
        actions={
          <>
            <Button href="/pricing" variant="secondary">
              Pricing
            </Button>
            <Button href="/dashboard" variant="secondary">
              Dashboard
            </Button>
          </>
        }
      />

      {checkout === "success" ? (
        <StatusMessage tone="success">Checkout complete. Your Pro plan is active.</StatusMessage>
      ) : null}

      <section className="note-form" aria-label="Pro status">
        <h2>Plan status</h2>
        <p className="muted">
          Plan: <strong>{plan.plan}</strong> · Status: <strong>{plan.status}</strong>
          {plan.currentPeriodEnd
            ? ` · Renews ${new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(plan.currentPeriodEnd)}`
            : null}
        </p>
        <p className="muted">
          Later phases can put paid-only features here. Phase 4 only needs a real gated page.
        </p>
      </section>
    </main>
  );
}
