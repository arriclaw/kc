import { BadgeType, EventType, type Event } from "@prisma/client";
import { differenceInDays } from "date-fns";

export function computeBadges(events: Event[]): BadgeType[] {
  if (events.length === 0) return [];

  const sorted = [...events].sort((a, b) => +new Date(a.occurredAt) - +new Date(b.occurredAt));
  const badges: BadgeType[] = [];

  const hasThreeEvents = sorted.length >= 3;
  const spanDays = differenceInDays(sorted.at(-1)!.occurredAt, sorted[0].occurredAt);
  const hasOdometer = sorted.some((event) => event.odometerKm !== null);
  if (hasThreeEvents && spanDays >= 90 && hasOdometer) {
    badges.push(BadgeType.TRANSPARENT_OWNER);
  }

  const services = sorted.filter((event) => event.type === EventType.SERVICE);
  if (services.length >= 2) {
    const lastYearCutoff = new Date();
    lastYearCutoff.setMonth(lastYearCutoff.getMonth() - 12);
    const lastYearServices = services.filter((event) => event.occurredAt >= lastYearCutoff);
    let streak = true;
    for (let i = 1; i < lastYearServices.length; i += 1) {
      const gap = differenceInDays(lastYearServices[i].occurredAt, lastYearServices[i - 1].occurredAt);
      if (gap > 183) {
        streak = false;
        break;
      }
    }
    if (streak && lastYearServices.length >= 2) {
      badges.push(BadgeType.MAINTENANCE_STREAK);
    }
  }

  const latestService = services.at(-1);
  if (latestService && differenceInDays(new Date(), latestService.occurredAt) <= 90) {
    badges.push(BadgeType.RECENT_SERVICE);
  }

  const accidents = sorted.filter((event) => event.type === EventType.ACCIDENT);
  const odometerEvents = sorted.filter((event) => event.odometerKm !== null);
  const monotonic = odometerEvents.every((event, idx) => {
    if (idx === 0) return true;
    return (odometerEvents[idx - 1].odometerKm ?? 0) <= (event.odometerKm ?? 0);
  });

  if (accidents.length === 0 && monotonic && odometerEvents.length >= 2) {
    badges.push(BadgeType.LOW_RISK);
  }

  return badges;
}
