import { getPrisma } from "@/lib/prisma";
import {
  milestoneProgress,
  normalizeChecklistTitle,
  normalizeMilestoneTitle,
  type MilestoneProgress,
} from "@/lib/portfolio-helpers";

export type ChecklistItemSummary = {
  id: string;
  title: string;
  done: boolean;
  sortOrder: number;
};

export type MilestoneSummary = {
  id: string;
  title: string;
  description: string;
  targetDate: Date | null;
  updatedAt: Date;
  progress: MilestoneProgress;
  itemCount: number;
};

export type MilestoneDetail = MilestoneSummary & {
  items: ChecklistItemSummary[];
};

export async function listMilestones(userId: string): Promise<MilestoneSummary[]> {
  const prisma = getPrisma();
  const rows = await prisma.milestone.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      items: { select: { done: true } },
    },
  });

  return rows.map((row) => {
    const progress = milestoneProgress(row.items);
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      targetDate: row.targetDate,
      updatedAt: row.updatedAt,
      progress,
      itemCount: progress.total,
    };
  });
}

export async function getMilestone(userId: string, milestoneId: string): Promise<MilestoneDetail | null> {
  const prisma = getPrisma();
  const row = await prisma.milestone.findFirst({
    where: { id: milestoneId, userId },
    include: {
      items: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
    },
  });
  if (!row) return null;

  const items = row.items.map((item) => ({
    id: item.id,
    title: item.title,
    done: item.done,
    sortOrder: item.sortOrder,
  }));
  const progress = milestoneProgress(items);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    targetDate: row.targetDate,
    updatedAt: row.updatedAt,
    progress,
    itemCount: progress.total,
    items,
  };
}

export async function createMilestone(userId: string, title: string, description: string) {
  const prisma = getPrisma();
  return prisma.milestone.create({
    data: {
      userId,
      title: normalizeMilestoneTitle(title),
      description: description.trim(),
    },
  });
}

export async function updateMilestone(
  userId: string,
  milestoneId: string,
  title: string,
  description: string,
) {
  const prisma = getPrisma();
  const existing = await prisma.milestone.findFirst({ where: { id: milestoneId, userId } });
  if (!existing) return null;

  return prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      title: normalizeMilestoneTitle(title),
      description: description.trim(),
    },
  });
}

export async function deleteMilestone(userId: string, milestoneId: string) {
  const prisma = getPrisma();
  const existing = await prisma.milestone.findFirst({ where: { id: milestoneId, userId } });
  if (!existing) return false;
  await prisma.milestone.delete({ where: { id: milestoneId } });
  return true;
}

export async function addChecklistItem(userId: string, milestoneId: string, title: string) {
  const prisma = getPrisma();
  const milestone = await prisma.milestone.findFirst({ where: { id: milestoneId, userId } });
  if (!milestone) return null;

  const last = await prisma.checklistItem.findFirst({
    where: { milestoneId, userId },
    orderBy: { sortOrder: "desc" },
  });

  return prisma.checklistItem.create({
    data: {
      userId,
      milestoneId,
      title: normalizeChecklistTitle(title),
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });
}

export async function toggleChecklistItem(userId: string, itemId: string) {
  const prisma = getPrisma();
  const item = await prisma.checklistItem.findFirst({ where: { id: itemId, userId } });
  if (!item) return null;

  return prisma.checklistItem.update({
    where: { id: itemId },
    data: { done: !item.done },
  });
}

export async function deleteChecklistItem(userId: string, itemId: string) {
  const prisma = getPrisma();
  const item = await prisma.checklistItem.findFirst({ where: { id: itemId, userId } });
  if (!item) return false;
  await prisma.checklistItem.delete({ where: { id: itemId } });
  return true;
}

export async function getPortfolioScore(userId: string) {
  const milestones = await listMilestones(userId);
  const totalItems = milestones.reduce((sum, m) => sum + m.progress.total, 0);
  const doneItems = milestones.reduce((sum, m) => sum + m.progress.done, 0);
  const percent = totalItems === 0 ? 0 : Math.round((doneItems / totalItems) * 100);
  return {
    milestoneCount: milestones.length,
    totalItems,
    doneItems,
    percent,
  };
}
