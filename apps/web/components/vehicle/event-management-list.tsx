"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Item = {
  id: string;
  title: string;
  type: string;
  occurredAt: string;
  sourceKind: "SELF_DECLARED" | "DEALER_ENTERED" | "THIRD_PARTY";
};

type Props = {
  vehicleId: string;
  events: Item[];
};

const sourceLabel: Record<Item["sourceKind"], string> = {
  SELF_DECLARED: "Autodeclarado",
  DEALER_ENTERED: "Automotora",
  THIRD_PARTY: "Tercero"
};

export function EventManagementList({ vehicleId, events }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function deleteEvent(eventId: string, title: string) {
    const confirmed = window.confirm(`¿Seguro que querés borrar el evento "${title}"?`);
    if (!confirmed) return;

    setDeletingId(eventId);
    setError(null);

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/events/${eventId}`, {
        method: "DELETE"
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.error || "No se pudo borrar el evento.");
        return;
      }

      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-3">
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no hay eventos para gestionar.</p>
      ) : null}

      {events.map((event) => (
        <Card key={event.id} className="rounded-xl border bg-muted/40 p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold">{event.title}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(event.occurredAt).toLocaleDateString("es-UY")} · {event.type} · {sourceLabel[event.sourceKind]}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={deletingId === event.id}
              onClick={() => void deleteEvent(event.id, event.title)}
              className="border-red-400/40 text-red-200 hover:border-red-300/70 hover:bg-red-500/10"
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              {deletingId === event.id ? "Borrando..." : "Borrar"}
            </Button>
          </div>
        </Card>
      ))}

      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
