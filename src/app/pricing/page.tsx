import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const { userId } = await auth();

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Pricing"
        title="Payments deferred"
        titleId="pricing-heading"
        description="Monetization is on hold. Stripe is not a fit for India right now; Razorpay can be added later if we reopen this phase."
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

      <EmptyState
        title="Everything is free for now"
        description="Notes and Focus stay fully available. No subscription or checkout while Phase 4 is deferred."
      >
        <Button href={userId ? "/dashboard" : "/sign-up"} variant="primary">
          {userId ? "Back to dashboard" : "Create account"}
        </Button>
      </EmptyState>
    </main>
  );
}
