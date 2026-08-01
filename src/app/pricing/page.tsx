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
        title="Free while we build"
        titleId="pricing-heading"
        description="StudyFlow is free to use. Paid plans are not offered yet."
      />

      <EmptyState
        title="No paid plans right now"
        description="Notes, Focus, Portfolio, and Outreach are available on every account."
      >
        <Button href={userId ? "/dashboard" : "/sign-up"} variant="primary">
          {userId ? "Open workspace" : "Create account"}
        </Button>
      </EmptyState>
    </main>
  );
}
