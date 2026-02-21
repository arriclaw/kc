import { BadgeType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { computeBadges } from "@/lib/badges";

export async function syncVehicleBadges(vehicleId: string) {
  const events = await prisma.event.findMany({ where: { vehicleId }, orderBy: { occurredAt: "asc" } });
  const computed = computeBadges(events);

  const current = await prisma.badge.findMany({ where: { vehicleId } });
  const currentSet = new Set(current.map((item) => item.badgeType));
  const computedSet = new Set(computed);

  const toCreate = computed.filter((badge) => !currentSet.has(badge));
  const toDelete = current
    .filter((badge) => !computedSet.has(badge.badgeType))
    .map((badge) => badge.badgeType);

  if (toCreate.length) {
    await prisma.badge.createMany({
      data: toCreate.map((badge) => ({
        vehicleId,
        badgeType: badge
      }))
    });
  }

  if (toDelete.length) {
    await prisma.badge.deleteMany({
      where: {
        vehicleId,
        badgeType: {
          in: toDelete as BadgeType[]
        }
      }
    });
  }
}
