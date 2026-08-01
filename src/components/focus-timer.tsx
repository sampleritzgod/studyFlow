"use client";

import { Button } from "@/components/button";
import { abandonSessionAction, completeSessionAction } from "@/app/focus/actions";
import { useEffect, useMemo, useState } from "react";

type FocusTimerProps = {
  sessionId: string;
  plannedMinutes: number;
  startedAtIso: string;
  label: string;
};

function formatClock(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function FocusTimer({ sessionId, plannedMinutes, startedAtIso, label }: FocusTimerProps) {
  const endsAt = useMemo(
    () => new Date(startedAtIso).getTime() + plannedMinutes * 60_000,
    [startedAtIso, plannedMinutes],
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remainingSeconds = Math.ceil((endsAt - now) / 1000);
  const done = remainingSeconds <= 0;

  return (
    <section className="focus-timer" aria-live="polite">
      <p className="eyebrow">{label || "Focus session"}</p>
      <p className="focus-clock" aria-label="Time remaining">
        {done ? "00:00" : formatClock(remainingSeconds)}
      </p>
      <p className="muted">
        {done
          ? "Time is up. Mark this session complete to save it."
          : `${plannedMinutes} minute session in progress.`}
      </p>
      <div className="action-row">
        <form action={completeSessionAction}>
          <input type="hidden" name="sessionId" value={sessionId} />
          <Button type="submit" variant="primary">
            {done ? "Save completed session" : "Complete early"}
          </Button>
        </form>
        <form action={abandonSessionAction}>
          <input type="hidden" name="sessionId" value={sessionId} />
          <Button type="submit" variant="secondary">
            Abandon
          </Button>
        </form>
      </div>
    </section>
  );
}
