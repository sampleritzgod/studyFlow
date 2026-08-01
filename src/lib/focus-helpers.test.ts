import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildFocusScorecard,
  formatFocusDuration,
  minutesBetween,
} from "./focus-helpers.ts";

describe("minutesBetween", () => {
  it("rounds elapsed minutes", () => {
    const start = new Date("2026-08-01T10:00:00.000Z");
    const end = new Date("2026-08-01T10:25:00.000Z");
    assert.equal(minutesBetween(start, end), 25);
  });
});

describe("formatFocusDuration", () => {
  it("formats minutes and hours", () => {
    assert.equal(formatFocusDuration(25), "25m");
    assert.equal(formatFocusDuration(60), "1h");
    assert.equal(formatFocusDuration(90), "1h 30m");
  });
});

describe("buildFocusScorecard", () => {
  it("computes totals and completion rate", () => {
    const start = new Date("2026-08-01T10:00:00.000Z");
    const end = new Date("2026-08-01T10:25:00.000Z");
    const score = buildFocusScorecard([
      {
        status: "COMPLETED",
        plannedMinutes: 25,
        startedAt: start,
        endedAt: end,
      },
      {
        status: "ABANDONED",
        plannedMinutes: 25,
        startedAt: start,
        endedAt: start,
      },
      {
        status: "RUNNING",
        plannedMinutes: 25,
        startedAt: start,
        endedAt: null,
      },
    ]);

    assert.equal(score.completedCount, 1);
    assert.equal(score.abandonedCount, 1);
    assert.equal(score.totalFocusMinutes, 25);
    assert.equal(score.completionRate, 50);
  });
});
