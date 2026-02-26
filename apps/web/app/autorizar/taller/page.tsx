"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type RequestPayload = {
  request: {
    id: string;
    plate: string;
    vin?: string | null;
    status: string;
    expiresAt: string;
    workshop: {
      workshopName: string;
      phone?: string | null;
      address?: string | null;
      isVerified: boolean;
    };
  };
  canRespond: boolean;
  matchedVehicle?: {
    id: string;
    plate: string | null;
    make: string;
    model: string;
    year: number;
  } | null;
};

type VehicleItem = {
  id: string;
  plate: string | null;
  make: string;
  model: string;
  year: number;
};

export default function AutorizarTallerPage() {
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [data, setData] = useState<RequestPayload | null>(null);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [mode, setMode] = useState<"existing" | "create">("existing");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const expiresLabel = useMemo(() => {
    if (!data) return "";
    return new Date(data.request.expiresAt).toLocaleString("es-UY");
  }, [data]);

  useEffect(() => {
    if (!token) return;

    async function run() {
      const res = await fetch(`/api/authorize/workshop?token=${encodeURIComponent(token)}`);
      const body = (await res.json()) as RequestPayload | { error?: string };
      if (!res.ok) {
        setMessage((body as { error?: string }).error || "No se pudo abrir la solicitud.");
        return;
      }

      const payload = body as RequestPayload;
      setData(payload);
      if (payload.matchedVehicle?.id) setSelectedVehicleId(payload.matchedVehicle.id);

      const vehiclesRes = await fetch("/api/vehicles");
      if (vehiclesRes.ok) {
        const own = (await vehiclesRes.json()) as Array<{ id: string; plate: string | null; make: string; model: string; year: number }>;
        setVehicles(own.map((item) => ({ id: item.id, plate: item.plate, make: item.make, model: item.model, year: item.year })));
      } else {
        const dealerRes = await fetch("/api/dealer/vehicles");
        if (dealerRes.ok) {
          const dealer = (await dealerRes.json()) as Array<{ id: string; plate: string | null; make: string; model: string; year: number }>;
          setVehicles(dealer.map((item) => ({ id: item.id, plate: item.plate, make: item.make, model: item.model, year: item.year })));
        }
      }
    }

    void run();
  }, [token]);

  async function handleApprove() {
    if (!token) return;
    setLoading(true);
    setMessage(null);

    const payload =
      mode === "existing"
        ? { token, vehicleId: selectedVehicleId }
        : {
            token,
            createVehicle: {
              make,
              model,
              year: Number(year)
            }
          };

    const res = await fetch("/api/authorize/workshop/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const body = (await res.json().catch(() => ({}))) as { error?: string };

    if (!res.ok) {
      setMessage(body.error || "No se pudo autorizar.");
      setLoading(false);
      return;
    }

    setMessage("Acceso autorizado correctamente. El taller ya puede registrar eventos.");
    setLoading(false);
  }

  async function handleDeny() {
    if (!token) return;
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/authorize/workshop/deny", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });

    const body = (await res.json().catch(() => ({}))) as { error?: string };

    if (!res.ok) {
      setMessage(body.error || "No se pudo rechazar.");
      setLoading(false);
      return;
    }

    setMessage("Solicitud rechazada.");
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card className="surface-card space-y-4">
        <h1 className="text-3xl font-black">Autorizar Taller</h1>

        {!token ? <p className="text-sm text-rose-300">Token inválido.</p> : null}

        {data ? (
          <>
            <div className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-4 text-sm text-slate-200">
              <p className="font-semibold">{data.request.workshop.workshopName}</p>
              <p>Matrícula solicitada: {data.request.plate}</p>
              <p>Vence: {expiresLabel}</p>
            </div>

            {!data.canRespond ? (
              <p className="text-sm text-amber-300">Iniciá sesión como titular para responder esta solicitud.</p>
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button variant={mode === "existing" ? "default" : "outline"} onClick={() => setMode("existing")}>Usar vehículo existente</Button>
                  <Button variant={mode === "create" ? "default" : "outline"} onClick={() => setMode("create")}>Crear vehículo mínimo</Button>
                </div>

                {mode === "existing" ? (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Vehículo</label>
                    <Select value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)}>
                      <option value="">Seleccionar vehículo</option>
                      {vehicles.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.make} {item.model} ({item.year}) · {item.plate || "Sin matrícula"}
                        </option>
                      ))}
                    </Select>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Marca" />
                    <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Modelo" />
                    <Input value={year} onChange={(e) => setYear(e.target.value)} type="number" placeholder="Año" />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleApprove}
                    disabled={
                      loading ||
                      (mode === "existing" ? !selectedVehicleId : make.trim().length < 2 || model.trim().length < 1 || !year)
                    }
                  >
                    Autorizar
                  </Button>
                  <Button onClick={handleDeny} variant="outline" disabled={loading}>
                    Rechazar
                  </Button>
                </div>
              </>
            )}
          </>
        ) : null}

        {message ? <p className="text-sm text-cyan-200">{message}</p> : null}
      </Card>
    </div>
  );
}
