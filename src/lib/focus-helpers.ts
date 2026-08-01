export const POMODORO_MINUTES = 25;

export function minutesBetween(startedAt: Date, endedAt: Date): number {
  const ms = endedAt.getTime() - startedAt.getTime();
  return Math.max(0, Math.round(ms / 60000));
}

export function formatFocusDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem === 0 ? `${hours}h` : `${hours}h ${rem}m`;
}

export type ScorecardInput = {
  status: "COMPLETED" | "ABANDONED" | "RUNNING";
  plannedMinutes: number;
  startedAt: Date;
  endedAt: Date | null;
};

export type FocusScorecard = {
  completedCount: number;
  abandonedCount: number;
  totalFocusMinutes: number;
  completionRate: number;
};

export function buildFocusScorecard(sessions: ScorecardInput[]): FocusScorecard {
  let completedCount = 0;
  let abandonedCount = 0;
  let totalFocusMinutes = 0;

  for (const session of sessions) {
    if (session.status === "COMPLETED") {
      completedCount += 1;
      const end = session.endedAt ?? session.startedAt;
      totalFocusMinutes += minutesBetween(session.startedAt, end) || session.plannedMinutes;
    } else if (session.status === "ABANDONED") {
      abandonedCount += 1;
    }
  }

  const decided = completedCount + abandonedCount;
  const completionRate = decided === 0 ? 0 : Math.round((completedCount / decided) * 100);

  return {
    completedCount,
    abandonedCount,
    totalFocusMinutes,
    completionRate,
  };
}
