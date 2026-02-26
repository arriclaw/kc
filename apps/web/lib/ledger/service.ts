import { Prisma, type Event } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { payloadHash } from "./canonical";
import { computeEntryHash } from "./hash-chain";
import { buildMerkleProof, buildMerkleRoot, verifyMerkleProof, type MerkleProofNode } from "./merkle";
import { getLedgerKeyId, signEntryHash, verifyEntrySignature } from "./signing";

const GENESIS_HASH = "GENESIS";
const BATCH_SIZE = Number(process.env.LEDGER_BATCH_SIZE || 5);

export function eventPayloadForHash(event: Event, attachmentHashes: string[]) {
  const sortedAttachmentHashes = [...attachmentHashes].sort((a, b) => a.localeCompare(b));
  return {
    id: event.id,
    vehicleId: event.vehicleId,
    type: event.type,
    occurredAt: event.occurredAt.toISOString(),
    odometerKm: event.odometerKm,
    title: event.title,
    description: event.description,
    cost: event.cost?.toString() ?? null,
    location: event.location,
    sourceKind: event.sourceKind,
    verificationStatus: event.verificationStatus,
    createdByUserId: event.createdByUserId,
    createdByRole: event.createdByRole,
    workshopId: event.workshopId,
    consentGrantId: event.consentGrantId,
    correctionOfEventId: event.correctionOfEventId,
    attachmentHashes: sortedAttachmentHashes
  };
}

export async function commitEventToLedger(eventId: string) {
  return prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({
      where: { id: eventId },
      include: { attachments: true }
    });

    if (!event) {
      throw new Error("Event not found");
    }

    const existing = await tx.ledgerEntry.findUnique({ where: { entityId: eventId } });
    if (existing) {
      return existing;
    }

    const lastEntry = await tx.ledgerEntry.findFirst({ orderBy: { createdAt: "desc" } });
    const prevHash = lastEntry?.entryHash ?? GENESIS_HASH;
    const timestampIso = new Date().toISOString();
    const pHash = payloadHash(eventPayloadForHash(event, event.attachments.map((item) => item.sha256)));
    const entryHash = computeEntryHash({
      prevHash,
      payloadHash: pHash,
      timestampIso,
      entityType: "EVENT",
      entityId: event.id
    });

    const signature = signEntryHash(entryHash);

    const entry = await tx.ledgerEntry.create({
      data: {
        entityType: "EVENT",
        entityId: event.id,
        payloadHash: pHash,
        prevHash,
        entryHash,
        signature,
        signedByKeyId: getLedgerKeyId(),
        createdAt: new Date(timestampIso)
      }
    });

    await tryBatch(tx);

    return entry;
  });
}

async function tryBatch(tx: Prisma.TransactionClient) {
  const unbatched = await tx.ledgerEntry.findMany({
    where: { merkleRootBatchId: null },
    orderBy: { createdAt: "asc" },
    take: BATCH_SIZE
  });

  if (unbatched.length < BATCH_SIZE) {
    return;
  }

  const root = buildMerkleRoot(unbatched.map((entry) => entry.entryHash));
  const batch = await tx.ledgerBatch.create({
    data: {
      merkleRoot: root,
      entriesCount: unbatched.length,
      anchoredAt: new Date(),
      anchorRef: `local:${Date.now()}`
    }
  });

  await tx.ledgerEntry.updateMany({
    where: { id: { in: unbatched.map((item) => item.id) } },
    data: { merkleRootBatchId: batch.id }
  });
}

export async function verifyEventInLedger(eventId: string) {
  const entry = await prisma.ledgerEntry.findUnique({
    where: { entityId: eventId },
    include: { batch: true }
  });

  if (!entry) {
    return { ok: false, reason: "No ledger entry" };
  }

  const prev =
    entry.prevHash === GENESIS_HASH
      ? null
      : await prisma.ledgerEntry.findUnique({ where: { entryHash: entry.prevHash } });

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { attachments: true }
  });

  if (!event) {
    return { ok: false, reason: "Event not found" };
  }

  const recomputedPayloadHash = payloadHash(
    eventPayloadForHash(event, event.attachments.map((item) => item.sha256))
  );

  const chainValid = !prev || prev.entryHash === entry.prevHash;
  const payloadValid = recomputedPayloadHash === entry.payloadHash;
  const signatureValid = !!entry.signature && verifyEntrySignature(entry.entryHash, entry.signature);

  let merkleProof: MerkleProofNode[] = [];
  let merkleValid = false;

  if (entry.batch) {
    const batchEntries = await prisma.ledgerEntry.findMany({
      where: { merkleRootBatchId: entry.batch.id },
      orderBy: { createdAt: "asc" }
    });
    const idx = batchEntries.findIndex((item) => item.id === entry.id);
    merkleProof = buildMerkleProof(
      batchEntries.map((item) => item.entryHash),
      idx
    );
    merkleValid = verifyMerkleProof(entry.entryHash, merkleProof, entry.batch.merkleRoot);
  }

  return {
    ok: chainValid && payloadValid && signatureValid && (entry.batch ? merkleValid : true),
    entry,
    chainValid,
    payloadValid,
    signatureValid,
    merkle: entry.batch
      ? {
          batchId: entry.batch.id,
          merkleRoot: entry.batch.merkleRoot,
          proof: merkleProof,
          valid: merkleValid
        }
      : null
  };
}

export async function auditLedgerRange(from?: string, to?: string) {
  const where = {
    createdAt: {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined
    }
  };

  const entries = await prisma.ledgerEntry.findMany({
    where,
    orderBy: { createdAt: "asc" }
  });

  const anomalies: string[] = [];

  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    const expectedPrev = i === 0 ? GENESIS_HASH : entries[i - 1].entryHash;
    if (entry.prevHash !== expectedPrev) {
      anomalies.push(`Broken chain at ${entry.id}`);
    }
    if (!entry.signature || !verifyEntrySignature(entry.entryHash, entry.signature)) {
      anomalies.push(`Invalid signature at ${entry.id}`);
    }
  }

  return {
    entries: entries.length,
    anomalies,
    valid: anomalies.length === 0
  };
}
