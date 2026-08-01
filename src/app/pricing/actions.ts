"use server";

import { env } from "@/config/env";
import { getUserPlan, isProPlan, upsertStripeCustomer } from "@/lib/billing";
import { getPrisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function startProCheckoutAction() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/pricing");

  if (!env.stripeConfigured) {
    redirect(`/pricing?error=${encodeURIComponent("Stripe is not configured yet.")}`);
  }

  const plan = await getUserPlan(userId);
  if (isProPlan(plan)) {
    redirect("/pro");
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const stripe = getStripe();
  const prisma = getPrisma();

  const existing = await prisma.userSubscription.findUnique({ where: { userId } });
  let customerId = existing?.stripeCustomerId ?? null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: email ?? undefined,
      metadata: { clerkUserId: userId },
    });
    customerId = customer.id;
    await upsertStripeCustomer(userId, customerId);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: userId,
    line_items: [{ price: env.stripePriceId, quantity: 1 }],
    success_url: `${env.appUrl}/pro?checkout=success`,
    cancel_url: `${env.appUrl}/pricing?checkout=cancel`,
    metadata: { clerkUserId: userId },
    subscription_data: {
      metadata: { clerkUserId: userId },
    },
  });

  if (!session.url) {
    redirect(`/pricing?error=${encodeURIComponent("Could not start checkout.")}`);
  }

  redirect(session.url);
}
