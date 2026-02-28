"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema, type CreateEventInput } from "@hdv/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Stepper } from "@/components/ui/stepper";

const steps = [
  { id: "context", label: "Contexto", hint: "Tipo y fecha" },
  { id: "detail", label: "Detalle", hint: "Qué pasó" },
  { id: "proof", label: "Pruebas", hint: "Adjuntos" },
  { id: "confirm", label: "Confirmar", hint: "Inmutable" }
];

export function AddEventForm({
  vehicleId,
  endpoint,
  redirectTo,
  lockSourceKind,
  lockVerification
}: {
  vehicleId: string;
  endpoint?: string;
  redirectTo?: string;
  lockSourceKind?: "SELF_DECLARED" | "DEALER_ENTERED" | "WORKSHOP_ENTERED" | "THIRD_PARTY";
  lockVerification?: "UNVERIFIED" | "VERIFIED";
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState, watch, trigger, setValue } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      type: "SERVICE",
      sourceKind: lockSourceKind || "SELF_DECLARED",
      verificationStatus: lockVerification || "UNVERIFIED",
      occurredAt: new Date().toISOString().slice(0, 10)
    }
  });

  const values = watch();

  async function nextStep() {
    const fields: Record<number, Array<keyof CreateEventInput>> = {
      0: ["type", "occurredAt", "sourceKind", "verificationStatus"],
      1: ["title", "description", "odometerKm", "cost", "location"],
      2: ["correctionOfEventId"],
      3: []
    };
    const valid = await trigger(fields[step]);
    if (!valid) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  }

  const onSubmit = handleSubmit(async (rawValues) => {
    setError(null);
    const valuesToSend = {
      ...rawValues,
      odometerKm: Number.isNaN(rawValues.odometerKm) ? null : rawValues.odometerKm,
      cost: Number.isNaN(rawValues.cost) ? null : rawValues.cost
    };

    const fd = new FormData();
    fd.append("data", JSON.stringify(valuesToSend));

    const filesInput = document.getElementById("files") as HTMLInputElement | null;
    const files = filesInput?.files ? Array.from(filesInput.files) : [];
    files.forEach((file) => fd.append("files", file));

    const targetEndpoint = endpoint || `/api/vehicles/${vehicleId}/events`;

    const response = await fetch(targetEndpoint, {
      method: "POST",
      body: fd
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error || "No se pudo crear el evento. Verificá datos y reintentá.");
      return;
    }

    router.push(redirectTo || `/vehiculos/${vehicleId}`);
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Stepper steps={steps} current={step} />

      {step === 0 ? (
        <div className="kc-theme-card space-y-4 rounded-2xl border p-4">
          <h3 className="text-lg font-semibold text-[hsl(var(--text))]">Contexto del evento</h3>
          <div>
            <label className="text-sm font-medium text-[hsl(var(--text))]">Tipo</label>
            <Select {...register("type")}>
              <option value="ODOMETER">Odómetro</option>
              <option value="SERVICE">Servicio</option>
              <option value="REPAIR">Reparación</option>
              <option value="ACCIDENT">Accidente</option>
              <option value="INSPECTION">Inspección</option>
              <option value="OTHER">Otro</option>
              <option value="CORRECTION">Corrección</option>
            </Select>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[hsl(var(--text))]">Fecha</label>
              <Input type="date" {...register("occurredAt")} />
            </div>
            <div>
              <label className="text-sm font-medium text-[hsl(var(--text))]">Origen</label>
              {lockSourceKind ? (
                <Input
                  readOnly
                  value={
                    lockSourceKind === "WORKSHOP_ENTERED"
                      ? "Taller"
                      : lockSourceKind === "DEALER_ENTERED"
                        ? "Automotora"
                        : lockSourceKind === "THIRD_PARTY"
                          ? "Tercero"
                          : "Autodeclarado"
                  }
                />
              ) : (
                <Select {...register("sourceKind")}>
                  <option value="SELF_DECLARED">Autodeclarado</option>
                  <option value="DEALER_ENTERED">Automotora</option>
                  <option value="WORKSHOP_ENTERED">Taller</option>
                  <option value="THIRD_PARTY">Tercero</option>
                </Select>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[hsl(var(--text))]">Nivel de verificación</label>
            {lockVerification ? (
              <Input readOnly value={lockVerification === "VERIFIED" ? "Verificado" : "Sin verificar"} />
            ) : (
              <Select {...register("verificationStatus")}>
                <option value="UNVERIFIED">Sin verificar</option>
                <option value="VERIFIED">Verificado</option>
              </Select>
            )}
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="kc-theme-card space-y-4 rounded-2xl border p-4">
          <h3 className="text-lg font-semibold text-[hsl(var(--text))]">Detalle útil para compradores</h3>
          <div>
            <label className="text-sm font-medium text-[hsl(var(--text))]">Título</label>
            <Input {...register("title")} placeholder="Servicio 60.000 km" />
          </div>
          <div>
            <label className="text-sm font-medium text-[hsl(var(--text))]">Descripción</label>
            <Textarea {...register("description")} placeholder="Cambio de aceite, filtros y revisión de frenos" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-[hsl(var(--text))]">Odómetro (km)</label>
              <Input type="number" {...register("odometerKm", { valueAsNumber: true })} />
            </div>
            <div>
              <label className="text-sm font-medium text-[hsl(var(--text))]">Costo (opcional)</label>
              <Input type="number" step="0.01" {...register("cost", { valueAsNumber: true })} />
            </div>
            <div>
              <label className="text-sm font-medium text-[hsl(var(--text))]">Ubicación</label>
              <Input {...register("location")} placeholder="Montevideo" />
            </div>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="kc-theme-card space-y-4 rounded-2xl border p-4">
          <h3 className="text-lg font-semibold text-[hsl(var(--text))]">Pruebas y correcciones</h3>
          <p className="text-sm text-[hsl(var(--muted))]">
            Adjuntá documentación para respaldar el evento. Si necesitás corregir uno anterior, usá su ID.
          </p>
          <div>
            <label className="text-sm font-medium text-[hsl(var(--text))]">Comprobantes</label>
            <Input id="files" type="file" multiple />
          </div>
          <div>
            <label className="text-sm font-medium text-[hsl(var(--text))]">ID de evento a corregir (opcional)</label>
            <Input
              placeholder="UUID del evento original"
              value={values.correctionOfEventId ?? ""}
              onChange={(e) => setValue("correctionOfEventId", e.target.value || null)}
            />
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="kc-theme-card space-y-3 rounded-2xl border p-4">
          <h3 className="text-lg font-semibold text-[hsl(var(--text))]">Confirmación final</h3>
          <p className="rounded-xl border border-amber-500/45 bg-amber-500/12 p-3 text-sm text-amber-600">
            Este evento quedará registrado de forma inmutable. No se edita; las correcciones son aditivas.
          </p>
          <div className="grid gap-2 text-sm text-[hsl(var(--text))]">
            <p>
              <span className="font-medium">Tipo:</span> {values.type}
            </p>
            <p>
              <span className="font-medium">Fecha:</span> {values.occurredAt}
            </p>
            <p>
              <span className="font-medium">Título:</span> {values.title}
            </p>
            <p>
              <span className="font-medium">Origen:</span> {values.sourceKind}
            </p>
            <p>
              <span className="font-medium">Verificación:</span> {values.verificationStatus}
            </p>
          </div>
        </div>
      ) : null}

      {error ? (
        <p role="alert" aria-live="assertive" className="rounded-xl border border-rose-300/35 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 0 ? (
          <Button type="button" variant="outline" onClick={() => setStep((prev) => Math.max(prev - 1, 0))}>
            Volver
          </Button>
        ) : null}

        {step < steps.length - 1 ? (
          <Button type="button" onClick={nextStep}>
            Continuar
          </Button>
        ) : (
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? "Registrando..." : "Guardar evento"}
          </Button>
        )}
      </div>
    </form>
  );
}
