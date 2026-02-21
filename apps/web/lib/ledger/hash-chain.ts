import { sha256 } from "./canonical";

export function computeEntryHash(params: {
  prevHash: string;
  payloadHash: string;
  timestampIso: string;
  entityType: string;
  entityId: string;
}) {
  const { prevHash, payloadHash, timestampIso, entityType, entityId } = params;
  return sha256([prevHash, payloadHash, timestampIso, entityType, entityId].join("|"));
}
