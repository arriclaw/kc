import { describe, it, expect } from "vitest";
import { buildMerkleProof, buildMerkleRoot, verifyMerkleProof } from "@/lib/ledger/merkle";

describe("merkle proofs", () => {
  it("builds and verifies proof", () => {
    const leaves = ["a", "b", "c", "d"].map((x) => `${x}${x}`);
    const root = buildMerkleRoot(leaves);
    const proof = buildMerkleProof(leaves, 2);
    expect(verifyMerkleProof(leaves[2], proof, root)).toBe(true);
  });
});
