import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  milestoneProgress,
  normalizeChecklistTitle,
  normalizeMilestoneTitle,
} from "./portfolio-helpers.ts";

describe("milestoneProgress", () => {
  it("handles empty and mixed checklists", () => {
    assert.deepEqual(milestoneProgress([]), { total: 0, done: 0, percent: 0 });
    assert.deepEqual(milestoneProgress([{ done: true }, { done: false }, { done: true }]), {
      total: 3,
      done: 2,
      percent: 67,
    });
  });
});

describe("normalize titles", () => {
  it("trims and falls back", () => {
    assert.equal(normalizeMilestoneTitle("  Internships  "), "Internships");
    assert.equal(normalizeMilestoneTitle("  "), "Untitled milestone");
    assert.equal(normalizeChecklistTitle(""), "Untitled item");
  });
});
