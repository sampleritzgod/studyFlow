import assert from "node:assert/strict";
import { describe, it } from "node:test";

// Mirror plan-gate logic without Prisma — keep gate rules explicit and tested.
function isProPlan(state: { plan: string; status: string }) {
  return state.plan === "PRO" && state.status === "ACTIVE";
}

describe("isProPlan gate", () => {
  it("allows only active Pro", () => {
    assert.equal(isProPlan({ plan: "PRO", status: "ACTIVE" }), true);
    assert.equal(isProPlan({ plan: "PRO", status: "CANCELED" }), false);
    assert.equal(isProPlan({ plan: "FREE", status: "ACTIVE" }), false);
    assert.equal(isProPlan({ plan: "FREE", status: "INACTIVE" }), false);
  });
});
