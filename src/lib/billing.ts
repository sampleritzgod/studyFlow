import { Plan, SubscriptionStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";

export type UserPlanState = {
  plan: Plan;
  status: SubscriptionStatus;
  currentPeriodEnd: Date | null;
};

export async function getUserPlan(userId: string): Promise<UserPlanState> {
  const prisma = getPrisma();
  const row = await prisma.userSubscription.findUnique({ where: { userId } });

  if (!row) {
    return {
      plan: Plan.FREE,
      status: SubscriptionStatus.INACTIVE,
      currentPeriodEnd: null,
    };
  }

  return {
    plan: row.plan,
    status: row.status,
    currentPeriodEnd: row.currentPeriodEnd,
  };
}

export function isProPlan(state: UserPlanState): boolean {
  return state.plan === Plan.PRO && state.status === SubscriptionStatus.ACTIVE;
}

export async function upsertStripeCustomer(userId: string, customerId: string) {
  const prisma = getPrisma();
  return prisma.userSubscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: customerId,
      plan: Plan.FREE,
      status: SubscriptionStatus.INACTIVE,
    },
    update: {
      stripeCustomerId: customerId,
    },
  });
}

export async function applyCheckoutCompleted(input: {
  userId: string;
  customerId: string;
  subscriptionId: string;
  priceId: string | null;
  currentPeriodEnd: Date | null;
}) {
  const prisma = getPrisma();
  return prisma.userSubscription.upsert({
    where: { userId: input.userId },
    create: {
      userId: input.userId,
      plan: Plan.PRO,
      status: SubscriptionStatus.ACTIVE,
      stripeCustomerId: input.customerId,
      stripeSubscriptionId: input.subscriptionId,
      stripePriceId: input.priceId ?? undefined,
      currentPeriodEnd: input.currentPeriodEnd,
    },
    update: {
      plan: Plan.PRO,
      status: SubscriptionStatus.ACTIVE,
      stripeCustomerId: input.customerId,
      stripeSubscriptionId: input.subscriptionId,
      stripePriceId: input.priceId ?? undefined,
      currentPeriodEnd: input.currentPeriodEnd,
    },
  });
}

export async function applySubscriptionUpdated(input: {
  subscriptionId: string;
  status: string;
  priceId: string | null;
  currentPeriodEnd: Date | null;
  customerId: string;
  userId?: string | null;
}) {
  const prisma = getPrisma();
  const existing = await prisma.userSubscription.findFirst({
    where: {
      OR: [
        { stripeSubscriptionId: input.subscriptionId },
        ...(input.userId ? [{ userId: input.userId }] : []),
        { stripeCustomerId: input.customerId },
      ],
    },
  });

  if (!existing) return null;

  const active = input.status === "active" || input.status === "trialing";
  const pastDue = input.status === "past_due";

  return prisma.userSubscription.update({
    where: { id: existing.id },
    data: {
      stripeSubscriptionId: input.subscriptionId,
      stripeCustomerId: input.customerId,
      stripePriceId: input.priceId ?? existing.stripePriceId,
      currentPeriodEnd: input.currentPeriodEnd,
      plan: active ? Plan.PRO : Plan.FREE,
      status: active
        ? SubscriptionStatus.ACTIVE
        : pastDue
          ? SubscriptionStatus.PAST_DUE
          : SubscriptionStatus.CANCELED,
    },
  });
}

export async function applySubscriptionDeleted(subscriptionId: string) {
  const prisma = getPrisma();
  const existing = await prisma.userSubscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  });
  if (!existing) return null;

  return prisma.userSubscription.update({
    where: { id: existing.id },
    data: {
      plan: Plan.FREE,
      status: SubscriptionStatus.CANCELED,
      stripeSubscriptionId: null,
      currentPeriodEnd: null,
    },
  });
}
