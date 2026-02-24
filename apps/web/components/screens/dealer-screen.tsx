"use client";

import Link from "next/link";
import { CarFront, CircleCheckBig, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GarageVehicleCard } from "@/components/vehicle/garage-vehicle-card";
import { GarageAddVehicleInline } from "@/components/vehicle/garage-add-vehicle-inline";

type DealerVehicle = {
  id: string;
  plate: string | null;
  make: string;
  model: string;
  year: number;
  badges: Array<{ badgeType: string }>;
  events: Array<{ id: string; title: string; occurredAt: string; verificationStatus: "UNVERIFIED" | "VERIFIED" }>;
  eventsCount: number;
  verifiedCount: number;
  imageUrl: string;
};

export default function DealerPage() {
  const [vehicles, setVehicles] = useState<DealerVehicle[]>([]);

  async function loadVehicles() {
    const response = await fetch("/api/dealer/vehicles");
    if (!response.ok) return;
    const data = (await response.json()) as DealerVehicle[];
    setVehicles(data);
  }

  useEffect(() => {
    void loadVehicles();
  }, []);

  const totals = useMemo(() => {
    const entries = vehicles.reduce((acc, v) => acc + v.eventsCount, 0);
    const verified = vehicles.reduce((acc, v) => acc + v.verifiedCount, 0);
    const coverage = entries === 0 ? 0 : Math.round((verified / entries) * 100);
    return { entries, coverage };
  }, [vehicles]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-panel rounded-3xl p-5">
          <p className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-slate-400">
            <CarFront className="h-3.5 w-3.5" />
            Autos en cartera
          </p>
          <p className="mt-2 text-4xl font-black text-white">{vehicles.length}</p>
        </Card>
        <Card className="glass-panel rounded-3xl p-5">
          <p className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-slate-400">
            <CircleCheckBig className="h-3.5 w-3.5" />
            Entradas de historial
          </p>
          <p className="mt-2 text-4xl font-black text-white">{totals.entries}</p>
        </Card>
        <Card className="glass-panel rounded-3xl p-5">
          <p className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Cobertura verificada
          </p>
          <p className="mt-2 text-4xl font-black text-white">{totals.coverage}%</p>
        </Card>
      </section>

      <Card className="glass-panel rounded-[2rem] p-6">
        <p className="glass-chip inline-flex text-xs font-semibold uppercase tracking-wide">Mi Garage · Automotora</p>
        <h1 className="mt-3 text-3xl font-semibold">Operación comercial por vehículo, sin límites</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Cargá unidades, registrá servicios y transferencias por auto y sostené trazabilidad comercial real en cada publicación.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={() => document.getElementById("dealer-add-vehicle")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            Agregar unidad
          </Button>
          <Button asChild variant="outline">
            <Link href="/vehiculos">Explorar galería</Link>
          </Button>
        </div>
        <p className="mt-3 text-xs text-slate-300">Perfil Automotora: sin límite de vehículos para carga y gestión.</p>
      </Card>

      <Card id="dealer-add-vehicle" className="glass-panel space-y-4">
        <h2 className="text-lg font-bold text-white">Agregar vehículo al garage</h2>
        <p className="text-sm text-slate-300">
          Dalo de alta una sola vez y luego gestioná historial, eventos y transferencia desde la card de ese auto.
        </p>
        <GarageAddVehicleInline endpoint="/api/dealer/vehicles" onCreated={loadVehicles} />
      </Card>

      {vehicles.length === 0 ? (
        <Card className="glass-panel rounded-3xl p-6">
          <h2 className="text-xl font-semibold">Tu cartera está vacía</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-300">
            Agregá tu primera unidad para iniciar historial por vehículo y publicar con mayor confianza comercial.
          </p>
        </Card>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle) => (
          <GarageVehicleCard
            key={vehicle.id}
            id={vehicle.id}
            make={vehicle.make}
            model={vehicle.model}
            year={vehicle.year}
            plate={vehicle.plate}
            imageUrl={vehicle.imageUrl}
            badges={vehicle.badges}
            eventsCount={vehicle.eventsCount}
            verifiedCount={vehicle.verifiedCount}
            lastEventTitle={vehicle.events[0]?.title}
            lastEventDate={
              vehicle.events[0]
                ? `${new Date(vehicle.events[0].occurredAt).toLocaleDateString("es-UY")} · ${vehicle.events.length} eventos recientes`
                : undefined
            }
            noEventsCopy="Cargá el primer evento para activar trazabilidad comercial en esta unidad."
          />
        ))}
      </section>
    </div>
  );
}
