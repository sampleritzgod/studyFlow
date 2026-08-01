import { startProCheckoutAction } from "@/app/pricing/actions";
import { Button } from "@/components/button";
import { EmptyState, StatusMessage } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { env } from "@/config/env";
import { getUserPlan, isProPlan } from "@/lib/billing";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

type PricingPageProps = {
  searchParams: Promise<{
    error?: string;
    gate?: string;
    checkout?: string;
  }>;
};

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const { userId } = await auth();
  const { error, gate, checkout } = await searchParams;
  const plan = userId ? await getUserPlan(userId) : null;
  const pro = plan ? isProPlan(plan) : false;

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Pricing"
        title="Simple plans"
        titleId="pricing-heading"
        description="Notes and Focus stay free. Pro unlocks the paid workspace surface."
        actions={
          <>
            <Button href="/notes" variant="secondary">
              Notes
            </Button>
            <Button href="/focus" variant="secondary">
              Focus
            </Button>
          </>
        }
      />

      {gate === "pro" ? (
        <StatusMessage tone="error">Pro is required for that page. Upgrade below.</StatusMessage>
      ) : null}
      {checkout === "cancel" ? (
        <StatusMessage tone="error">Checkout canceled. No charge was made.</StatusMessage>
      ) : null}
      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}

      {!env.stripeConfigured ? (
        <EmptyState
          title="Stripe test keys needed"
          description="Add STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, and STRIPE_PRICE_ID to .env.local to enable checkout."
        />
      ) : null}

      <section className="pricing-grid" aria-label="Plans">
        <article className="card">
          <h2>Free</h2>
          <p className="card-value">$0</p>
          <p className="muted">Notes, links, graph, and focus tracker — always available.</p>
          <ul className="plan-list">
            <li>Notes CRUD + graph</li>
            <li>Pomodoro + scorecard</li>
          </ul>
          <Button href={userId ? "/notes" : "/sign-up"} variant="secondary">
            {userId ? "Continue free" : "Create account"}
          </Button>
        </article>

        <article className="card">
          <h2>Pro</h2>
          <p className="card-value">Test</p>
          <p className="muted">Stripe test-mode subscription. Unlock the Pro workspace.</p>
          <ul className="plan-list">
            <li>Everything in Free</li>
            <li>Pro workspace (`/pro`)</li>
          </ul>
          {pro ? (
            <Button href="/pro" variant="primary">
              Open Pro workspace
            </Button>
          ) : userId ? (
            <form action={startProCheckoutAction}>
              <Button type="submit" variant="primary" disabled={!env.stripeConfigured}>
                Upgrade with Stripe
              </Button>
            </form>
          ) : (
            <Button href="/sign-in?redirect_url=/pricing" variant="primary">
              Sign in to upgrade
            </Button>
          )}
        </article>
      </section>
    </main>
  );
}
