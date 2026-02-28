"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AccessRequestStatus = "PENDING" | "APPROVED" | "DENIED" | "EXPIRED";

type RequestItem = {
  id: string;
  plate: string;
  status: AccessRequestStatus;
  createdAt: string;
  workshop: {
    workshopName: string;
    isVerified: boolean;
    phone: string | null;
    address: string | null;
  };
  matchedVehicleId: string | null;
};

type Props = {
  initialRequests: RequestItem[];
};

export function OwnerWorkshopRequests({ initialRequests }: Props) {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const statusLabel: Record<AccessRequestStatus, string> = {
    PENDING: "Pendiente",
    APPROVED: "Aprobada",
    DENIED: "Rechazada",
    EXPIRED: "Expirada"
  };

  async function resolveRequest(requestId: string, action: "approve" | "deny") {
    setError(null);
    setLoadingId(requestId);
    const res = await fetch(`/api/owner/workshop-requests/${requestId}/${action}`, {
      method: "POST"
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(body?.error || "No se pudo procesar la solicitud.");
      setLoadingId(null);
      return;
    }

    setRequests((current) =>
      current.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: action === "approve" ? "APPROVED" : "DENIED"
            }
          : request
      )
    );
    setLoadingId(null);
  }

  return (
    <div className="space-y-3">
      {error ? (
        <Card className="surface-card border-rose-500/40 p-3 text-sm text-rose-500">{error}</Card>
      ) : null}
      {requests.map((request) => {
        const isPending = request.status === "PENDING";
        const canApprove = isPending && Boolean(request.matchedVehicleId);
        const waiting = loadingId === request.id;
        return (
          <Card key={request.id} className="surface-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[hsl(var(--accent))]">{request.workshop.workshopName}</p>
                <h2 className="text-lg font-bold text-[hsl(var(--text))]">Matrícula solicitada: {request.plate}</h2>
                <p className="text-sm text-[hsl(var(--muted))]">Estado: {statusLabel[request.status]}</p>
                <p className="text-xs text-[hsl(var(--muted))]">Creada: {new Date(request.createdAt).toLocaleString("es-UY")}</p>
                {!request.matchedVehicleId ? (
                  <p className="mt-2 text-xs text-amber-500">
                    No encontramos este vehículo en tu titularidad actual para autorizar.
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[hsl(var(--muted))]">
                  {request.workshop.isVerified ? "Taller verificado" : "Taller no verificado"}
                </span>
                {isPending ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => resolveRequest(request.id, "approve")}
                      disabled={!canApprove || waiting}
                      className="gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Autorizar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveRequest(request.id, "deny")}
                      disabled={waiting}
                      className="gap-1.5"
                    >
                      <XCircle className="h-4 w-4" />
                      Rechazar
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
