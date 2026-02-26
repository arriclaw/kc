"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RevokeWorkshopGrantAction({ vehicleId, grantId }: { vehicleId: string; grantId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRevoke() {
    const confirmed = window.confirm("¿Revocar acceso del taller para este vehículo?");
    if (!confirmed) return;

    setLoading(true);
    const res = await fetch(`/api/vehicles/${vehicleId}/workshop-grants/${grantId}/revoke`, {
      method: "POST"
    });
    setLoading(false);

    if (!res.ok) {
      window.alert("No se pudo revocar el acceso.");
      return;
    }

    router.refresh();
  }

  return (
    <Button size="sm" variant="outline" onClick={handleRevoke} disabled={loading}>
      {loading ? "Revocando..." : "Revocar acceso"}
    </Button>
  );
}
