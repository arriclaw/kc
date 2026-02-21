import { describe, it, expect } from "vitest";
import { EventType, VerificationStatus, SourceKind } from "@prisma/client";
import { computeBadges } from "@/lib/badges";

function event(overrides: Partial<{ type: EventType; occurredAt: Date; odometerKm: number | null }>) {
  return {
    id: crypto.randomUUID(),
    vehicleId: "v1",
    type: overrides.type ?? EventType.SERVICE,
    occurredAt: overrides.occurredAt ?? new Date(),
    odometerKm: overrides.odometerKm ?? null,
    title: "e",
    description: "d",
    cost: null,
    location: null,
    createdByUserId: "u1",
    sourceKind: SourceKind.SELF_DECLARED,
    verificationStatus: VerificationStatus.UNVERIFIED,
    needsClarification: false,
    correctionOfEventId: null,
    createdAt: new Date()
  };
}

describe("badge rules", () => {
  it("awards transparent owner with enough span and odometer", () => {
    const now = new Date();
    const events = [
      event({ occurredAt: new Date(now.getTime() - 110 * 86400000), odometerKm: 10000, type: EventType.ODOMETER }),
      event({ occurredAt: new Date(now.getTime() - 50 * 86400000), odometerKm: 15000, type: EventType.SERVICE }),
      event({ occurredAt: now, odometerKm: 17000, type: EventType.REPAIR })
    ];
    const badges = computeBadges(events as never);
    expect(badges).toContain("TRANSPARENT_OWNER");
  });
});
