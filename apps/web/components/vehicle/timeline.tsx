"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { VerificationChip, SourceChip } from "@/components/vehicle/chips";

type TimelineEvent = {
  id: string;
  type: string;
  occurredAt: string;
  title: string;
  description?: string;
  odometerKm?: number | null;
  sourceKind: "SELF_DECLARED" | "DEALER_ENTERED" | "THIRD_PARTY";
  verificationStatus: "UNVERIFIED" | "VERIFIED";
  needsClarification?: boolean;
};

export function EventTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="space-y-4">
      {events.map((event, idx) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card>
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">{new Date(event.occurredAt).toLocaleDateString("es-UY")}</p>
                <h3 className="text-base font-semibold">{event.title}</h3>
              </div>
              <div className="flex gap-2">
                <SourceChip value={event.sourceKind} />
                <VerificationChip value={event.verificationStatus} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{event.description}</p>
            {event.odometerKm !== undefined && event.odometerKm !== null ? (
              <p className="mt-2 text-xs font-medium">Odómetro: {event.odometerKm.toLocaleString("es-UY")} km</p>
            ) : null}
            {event.needsClarification ? (
              <p className="mt-2 text-xs text-amber-700">Este evento necesita aclaración por posible inconsistencia de odómetro.</p>
            ) : null}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
