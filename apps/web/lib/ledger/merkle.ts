import { sha256 } from "./canonical";

export type MerkleProofNode = { position: "left" | "right"; hash: string };

export function buildMerkleRoot(leaves: string[]): string {
  if (leaves.length === 0) {
    return sha256("empty");
  }
  let level = [...leaves];
  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left;
      next.push(sha256(left + right));
    }
    level = next;
  }
  return level[0];
}

export function buildMerkleProof(leaves: string[], leafIndex: number): MerkleProofNode[] {
  if (leafIndex < 0 || leafIndex >= leaves.length) {
    return [];
  }
  const proof: MerkleProofNode[] = [];
  let index = leafIndex;
  let level = [...leaves];

  while (level.length > 1) {
    const isRight = index % 2 === 1;
    const pairIndex = isRight ? index - 1 : index + 1;
    const pairHash = level[pairIndex] ?? level[index];

    proof.push({
      position: isRight ? "left" : "right",
      hash: pairHash
    });

    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left;
      next.push(sha256(left + right));
    }

    index = Math.floor(index / 2);
    level = next;
  }

  return proof;
}

export function verifyMerkleProof(leaf: string, proof: MerkleProofNode[], expectedRoot: string): boolean {
  let hash = leaf;
  for (const node of proof) {
    hash = node.position === "left" ? sha256(node.hash + hash) : sha256(hash + node.hash);
  }
  return hash === expectedRoot;
}
