import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canonicalLinkPair, normalizeNoteTitle } from "./note-helpers.ts";

describe("normalizeNoteTitle", () => {
  it("trims whitespace", () => {
    assert.equal(normalizeNoteTitle("  Focus notes  "), "Focus notes");
  });

  it("falls back to Untitled when empty", () => {
    assert.equal(normalizeNoteTitle("   "), "Untitled");
    assert.equal(normalizeNoteTitle(""), "Untitled");
  });
});

describe("canonicalLinkPair", () => {
  it("orders ids stably regardless of input order", () => {
    assert.deepEqual(canonicalLinkPair("b", "a"), ["a", "b"]);
    assert.deepEqual(canonicalLinkPair("a", "b"), ["a", "b"]);
  });

  it("keeps equal endpoints unchanged", () => {
    assert.deepEqual(canonicalLinkPair("same", "same"), ["same", "same"]);
  });
});
