"use client";

import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const inlineVehicleSchema = z.object({
  plate: z.string().min(3, "Ingresá una matrícula válida."),
  make: z.string().min(2, "Ingresá una marca."),
  model: z.string().min(1, "Ingresá un modelo."),
  year: z
    .number()
    .int()
    .min(1900, "Ingresá un año válido.")
    .max(new Date().getFullYear() + 1, "Ingresá un año válido.")
});

type GarageAddVehicleInlineProps = {
  endpoint: "/api/vehicles" | "/api/dealer/vehicles";
  onCreated?: () => Promise<void> | void;
  buttonLabel?: string;
};

export function GarageAddVehicleInline({
  endpoint,
  onCreated,
  buttonLabel = "Agregar vehículo"
}: GarageAddVehicleInlineProps) {
  const router = useRouter();
  const [plate, setPlate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submitVehicle() {
    setStatus(null);
    setError(null);

    const parsed = inlineVehicleSchema.safeParse({
      plate: plate.trim().toUpperCase(),
      make: make.trim(),
      model: model.trim(),
      year: Number(year)
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Revisá los datos del vehículo.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, country: "UY" })
      });

      const payload = (await response.json().catch(() => ({}))) as { error?: string; disambiguationWarning?: boolean };
      if (!response.ok) {
        setError(payload.error || "No se pudo registrar el vehículo.");
        return;
      }

      setPlate("");
      setMake("");
      setModel("");
      setYear(String(new Date().getFullYear()));
      setStatus(
        payload.disambiguationWarning
          ? "Vehículo registrado. Detectamos matrícula repetida: validá marca/modelo para evitar confusión."
          : "Vehículo agregado a Mi Garage."
      );
      router.refresh();
      await onCreated?.();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Matrícula" />
        <Input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Marca" />
        <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Modelo" />
        <Input value={year} onChange={(e) => setYear(e.target.value)} type="number" placeholder="Año" />
        <Button onClick={submitVehicle} disabled={submitting}>
          <PlusCircle className="mr-1.5 h-4 w-4" />
          {submitting ? "Guardando..." : buttonLabel}
        </Button>
      </div>

      {status ? (
        <p
          role="status"
          aria-live="polite"
          className="rounded-xl border border-cyan-300/35 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100"
        >
          {status}
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          aria-live="assertive"
          className="rounded-xl border border-rose-300/35 bg-rose-300/10 px-3 py-2 text-sm text-rose-100"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
