import { describe, it, expect } from "vitest";
import { computeEntryHash } from "@/lib/ledger/hash-chain";
import { buildMerkleRoot } from "@/lib/ledger/merkle";

describe("integration smoke", () => {
  it("vehicle->event->verify primitives are consistent", () => {
    const entryA = computeEntryHash({
      prevHash: "GENESIS",
      payloadHash: "p1",
      timestampIso: "2026-02-01T10:00:00.000Z",
      entityType: "EVENT",
      entityId: "e1"
    });
    const entryB = computeEntryHash({
      prevHash: entryA,
      payloadHash: "p2",
      timestampIso: "2026-02-02T10:00:00.000Z",
      entityType: "EVENT",
      entityId: "e2"
    });
    const root = buildMerkleRoot([entryA, entryB]);
    expect(root.length).toBe(64);
    expect(entryB).not.toBe(entryA);
  });
});
