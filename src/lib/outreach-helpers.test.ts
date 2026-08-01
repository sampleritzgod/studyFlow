import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { draftOutreachEmail, normalizeContactName } from "./outreach-helpers.ts";

describe("normalizeContactName", () => {
  it("trims and falls back", () => {
    assert.equal(normalizeContactName("  Ada  "), "Ada");
    assert.equal(normalizeContactName(" "), "Untitled contact");
  });
});

describe("draftOutreachEmail", () => {
  it("includes contact context in a usable draft", () => {
    const draft = draftOutreachEmail({
      name: "Ada Lovelace",
      company: "Analytical Engines",
      role: "Research",
      relationship: "we met at a campus talk",
      notes: "Asked about internships",
    });

    assert.match(draft.subject, /Research/i);
    assert.match(draft.body, /Ada/);
    assert.match(draft.body, /Analytical Engines/);
    assert.match(draft.body, /campus talk/);
    assert.match(draft.body, /internships/i);
  });
});
