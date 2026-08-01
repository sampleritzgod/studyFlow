import { env } from "@/config/env";
import {
  applyCheckoutCompleted,
  applySubscriptionDeleted,
  applySubscriptionUpdated,
} from "@/lib/billing";
import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function periodEndFromSubscription(subscription: Stripe.Subscription): Date | null {
  const unix =
    subscription.items.data[0]?.current_period_end ??
    // Fallback for API shapes that still expose it on the subscription root.
    (subscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;
  return typeof unix === "number" ? new Date(unix * 1000) : null;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, env.stripeWebhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId = session.client_reference_id ?? session.metadata?.clerkUserId ?? null;
        if (!clerkUserId || typeof session.customer !== "string") break;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await applyCheckoutCompleted({
          userId: clerkUserId,
          customerId: session.customer,
          subscriptionId,
          priceId: subscription.items.data[0]?.price.id ?? null,
          currentPeriodEnd: periodEndFromSubscription(subscription),
        });
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        await applySubscriptionUpdated({
          subscriptionId: subscription.id,
          status: subscription.status,
          priceId: subscription.items.data[0]?.price.id ?? null,
          currentPeriodEnd: periodEndFromSubscription(subscription),
          customerId,
          userId: subscription.metadata?.clerkUserId ?? null,
        });
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await applySubscriptionDeleted(subscription.id);
        break;
      }
      default:
        break;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
