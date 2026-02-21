import { describe, it, expect } from "vitest";
import { toCanonicalJson, payloadHash } from "@/lib/ledger/canonical";

describe("canonical json", () => {
  it("sorts keys recursively", () => {
    const a = { z: 1, a: { y: 2, b: 3 } };
    const b = { a: { b: 3, y: 2 }, z: 1 };

    expect(toCanonicalJson(a as never)).toBe(toCanonicalJson(b as never));
    expect(payloadHash(a as never)).toBe(payloadHash(b as never));
  });
});
