"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVehicleSchema, type CreateVehicleInput } from "@hdv/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stepper } from "@/components/ui/stepper";

const steps = [
  { id: "identity", label: "Identificación", hint: "Matrícula" },
  { id: "specs", label: "Ficha técnica", hint: "Marca, modelo, año" },
  { id: "privacy", label: "Privacidad", hint: "Qué se comparte" },
  { id: "review", label: "Confirmar", hint: "Revisión final" }
];

export function AddVehicleForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState, watch, trigger } = useForm<CreateVehicleInput>({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: {
      country: "UY",
      year: new Date().getFullYear()
    }
  });

  const values = watch();

  async function nextStep() {
    const fields: Record<number, Array<keyof CreateVehicleInput>> = {
      0: ["plate"],
      1: ["make", "model", "year"],
      2: ["country"],
      3: []
    };

    const valid = await trigger(fields[step]);
    if (!valid) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  }

  const onSubmit = handleSubmit(async (payload) => {
    setError(null);
    const response = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setError("No pudimos registrar el vehículo. Revisá los datos e intentá nuevamente.");
      return;
    }

    const data = await response.json();
    router.push(`/vehiculos/${data.vehicle.id}`);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Stepper steps={steps} current={step} />

      {step === 0 ? (
        <div className="space-y-4 rounded-2xl border bg-slate-950/55 p-4 border-slate-700/70">
          <h3 className="text-lg font-semibold text-white">Identificá tu vehículo</h3>
          <p className="text-sm text-slate-300">En Uruguay la matrícula suele ser el dato principal para identificarlo.</p>
          <div>
            <label className="text-sm font-medium">Matrícula</label>
            <Input {...register("plate")} placeholder="SAB1234" />
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-4 rounded-2xl border bg-slate-950/55 p-4 border-slate-700/70">
          <h3 className="text-lg font-semibold text-white">Completá la ficha técnica</h3>
          <p className="text-sm text-slate-300">Esto mejora la búsqueda, comparabilidad y confianza del historial.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Marca</label>
              <Input {...register("make")} placeholder="Toyota" />
            </div>
            <div>
              <label className="text-sm font-medium">Modelo</label>
              <Input {...register("model")} placeholder="Corolla" />
            </div>
            <div>
              <label className="text-sm font-medium">Año</label>
              <Input type="number" {...register("year", { valueAsNumber: true })} />
            </div>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4 rounded-2xl border bg-slate-950/55 p-4 border-slate-700/70">
          <h3 className="text-lg font-semibold text-white">Privacidad y alcance</h3>
          <p className="text-sm text-slate-300">
            Por defecto no compartimos identidad del titular. Los links públicos muestran solo lo necesario para evaluar
            historial.
          </p>
          <div>
            <label className="text-sm font-medium">País</label>
            <Input {...register("country")} />
          </div>
          <div className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-3 text-sm text-slate-300">
            Consejo: después de registrar, creá tu primer evento de service para activar señales de confianza.
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-3 rounded-2xl border bg-slate-950/55 p-4 border-slate-700/70">
          <h3 className="text-lg font-semibold text-white">Revisá antes de confirmar</h3>
          <div className="grid gap-2 text-sm">
            <p>
              <span className="font-medium">Matrícula:</span> {values.plate}
            </p>
            <p>
              <span className="font-medium">Vehículo:</span> {values.make} {values.model} ({values.year})
            </p>
            <p>
              <span className="font-medium">País:</span> {values.country}
            </p>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

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
            {formState.isSubmitting ? "Registrando..." : "Registrar vehículo"}
          </Button>
        )}
      </div>
    </form>
  );
}
