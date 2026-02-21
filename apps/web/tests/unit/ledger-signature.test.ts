import { describe, it, expect } from "vitest";
import { computeEntryHash } from "@/lib/ledger/hash-chain";
import { signEntryHash, verifyEntrySignature } from "@/lib/ledger/signing";

describe("ledger hashing and signatures", () => {
  it("creates deterministic hash and valid signature", () => {
    const entryHash = computeEntryHash({
      prevHash: "GENESIS",
      payloadHash: "abc123",
      timestampIso: "2026-01-01T00:00:00.000Z",
      entityType: "EVENT",
      entityId: "evt-1"
    });

    const signature = signEntryHash(entryHash);
    expect(verifyEntrySignature(entryHash, signature)).toBe(true);
    expect(verifyEntrySignature(`${entryHash}x`, signature)).toBe(false);
  });
});
