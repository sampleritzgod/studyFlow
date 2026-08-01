export type ChecklistProgressInput = {
  done: boolean;
};

export type MilestoneProgress = {
  total: number;
  done: number;
  percent: number;
};

export function milestoneProgress(items: ChecklistProgressInput[]): MilestoneProgress {
  const total = items.length;
  const done = items.filter((item) => item.done).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, percent };
}

export function normalizeMilestoneTitle(title: string): string {
  const trimmed = title.trim();
  return trimmed.length > 0 ? trimmed : "Untitled milestone";
}

export function normalizeChecklistTitle(title: string): string {
  const trimmed = title.trim();
  return trimmed.length > 0 ? trimmed : "Untitled item";
}
