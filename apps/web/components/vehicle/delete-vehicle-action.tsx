"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  vehicleId: string;
  vehicleLabel: string;
  className?: string;
};

export function DeleteVehicleAction({ vehicleId, vehicleLabel, className }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(`¿Seguro que querés borrar ${vehicleLabel}? Esta acción elimina también su historial.`);
    if (!confirmed || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.error || "No se pudo borrar el vehículo.");
        return;
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("space-y-1", className)}>
      <Button
        size="sm"
        variant="outline"
        onClick={handleDelete}
        disabled={loading}
        className="w-full border-red-400/40 text-red-200 hover:border-red-300/70 hover:bg-red-500/10"
      >
        <Trash2 className="mr-1.5 h-4 w-4" />
        {loading ? "Borrando..." : "Borrar vehículo"}
      </Button>
      {error ? (
        <p role="alert" aria-live="assertive" className="text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
