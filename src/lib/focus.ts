import { FocusSessionKind, FocusSessionStatus } from "@/generated/prisma/client";
import { buildFocusScorecard, type FocusScorecard } from "@/lib/focus-helpers";
import { getPrisma } from "@/lib/prisma";

export type FocusSessionSummary = {
  id: string;
  kind: FocusSessionKind;
  label: string;
  plannedMinutes: number;
  startedAt: Date;
  endedAt: Date | null;
  status: FocusSessionStatus;
};

export async function listFocusSessions(userId: string, limit = 30): Promise<FocusSessionSummary[]> {
  const prisma = getPrisma();
  return prisma.focusSession.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    take: limit,
    select: {
      id: true,
      kind: true,
      label: true,
      plannedMinutes: true,
      startedAt: true,
      endedAt: true,
      status: true,
    },
  });
}

export async function getActiveFocusSession(userId: string): Promise<FocusSessionSummary | null> {
  const prisma = getPrisma();
  return prisma.focusSession.findFirst({
    where: { userId, status: FocusSessionStatus.RUNNING },
    orderBy: { startedAt: "desc" },
    select: {
      id: true,
      kind: true,
      label: true,
      plannedMinutes: true,
      startedAt: true,
      endedAt: true,
      status: true,
    },
  });
}

export async function startFocusSession(
  userId: string,
  input: {
    kind: FocusSessionKind;
    plannedMinutes: number;
    label?: string;
  },
) {
  const prisma = getPrisma();

  await prisma.focusSession.updateMany({
    where: { userId, status: FocusSessionStatus.RUNNING },
    data: {
      status: FocusSessionStatus.ABANDONED,
      endedAt: new Date(),
    },
  });

  return prisma.focusSession.create({
    data: {
      userId,
      kind: input.kind,
      plannedMinutes: input.plannedMinutes,
      label: input.label?.trim() ?? "",
      status: FocusSessionStatus.RUNNING,
    },
  });
}

export async function completeFocusSession(userId: string, sessionId: string) {
  const prisma = getPrisma();
  const existing = await prisma.focusSession.findFirst({
    where: { id: sessionId, userId, status: FocusSessionStatus.RUNNING },
  });
  if (!existing) return null;

  return prisma.focusSession.update({
    where: { id: sessionId },
    data: {
      status: FocusSessionStatus.COMPLETED,
      endedAt: new Date(),
    },
  });
}

export async function abandonFocusSession(userId: string, sessionId: string) {
  const prisma = getPrisma();
  const existing = await prisma.focusSession.findFirst({
    where: { id: sessionId, userId, status: FocusSessionStatus.RUNNING },
  });
  if (!existing) return null;

  return prisma.focusSession.update({
    where: { id: sessionId },
    data: {
      status: FocusSessionStatus.ABANDONED,
      endedAt: new Date(),
    },
  });
}

export async function getFocusScorecard(userId: string): Promise<FocusScorecard> {
  const prisma = getPrisma();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const sessions = await prisma.focusSession.findMany({
    where: { userId, startedAt: { gte: weekAgo } },
    select: {
      status: true,
      plannedMinutes: true,
      startedAt: true,
      endedAt: true,
    },
  });

  return buildFocusScorecard(sessions);
}
