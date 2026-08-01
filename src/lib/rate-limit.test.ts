import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkRateLimit, resetRateLimitBuckets } from "./rate-limit.ts";

describe("checkRateLimit", () => {
  it("allows up to the limit then blocks", () => {
    resetRateLimitBuckets();
    const key = "test:ip";
    const now = 1_000_000;

    assert.equal(checkRateLimit(key, 2, 60_000, now).allowed, true);
    assert.equal(checkRateLimit(key, 2, 60_000, now + 1).allowed, true);
    assert.equal(checkRateLimit(key, 2, 60_000, now + 2).allowed, false);
  });

  it("resets after the window", () => {
    resetRateLimitBuckets();
    const key = "test:reset";
    const now = 2_000_000;

    assert.equal(checkRateLimit(key, 1, 1_000, now).allowed, true);
    assert.equal(checkRateLimit(key, 1, 1_000, now + 500).allowed, false);
    assert.equal(checkRateLimit(key, 1, 1_000, now + 1_001).allowed, true);
  });
});
