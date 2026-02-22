"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BadgePills } from "@/components/vehicle/badge-pills";
import { TransferVehicleAction } from "@/components/vehicle/transfer-vehicle-action";
import { DeleteVehicleAction } from "@/components/vehicle/delete-vehicle-action";

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
  const [status, setStatus] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<DealerVehicle[]>([]);

  const [plate, setPlate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));

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

  async function createVehicle() {
    const response = await fetch("/api/dealer/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plate,
        make,
        model,
        year: Number(year),
        country: "UY"
      })
    });

    if (!response.ok) {
      setStatus("No se pudo crear el vehículo.");
      return;
    }

    setStatus("Vehículo agregado a Mi Garage.");
    setPlate("");
    setMake("");
    setModel("");
    setYear(String(new Date().getFullYear()));
    await loadVehicles();
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Autos en cartera</p>
          <p className="mt-2 text-4xl font-black text-white">{vehicles.length}</p>
        </Card>
        <Card className="glass-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Entradas de historial</p>
          <p className="mt-2 text-4xl font-black text-white">{totals.entries}</p>
        </Card>
        <Card className="glass-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Cobertura verificada</p>
          <p className="mt-2 text-4xl font-black text-white">{totals.coverage}%</p>
        </Card>
      </section>

      <Card className="glass-panel rounded-[2rem] p-6">
        <p className="glass-chip inline-flex text-xs font-semibold uppercase tracking-wide">Mi Garage · Automotora</p>
        <h1 className="mt-3 text-3xl font-semibold">Mi garage y operación comercial</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Podés cargar múltiples vehículos sin límite y registrar lo realizado en cada unidad.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/vehiculos">Explorar galería</Link>
          </Button>
        </div>
      </Card>

      <Card className="glass-panel space-y-4">
        <h2 className="text-lg font-bold text-white">Agregar vehículo al garage</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Matrícula" />
          <Input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Marca" />
          <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Modelo" />
          <Input value={year} onChange={(e) => setYear(e.target.value)} type="number" placeholder="Año" />
          <Button onClick={createVehicle}>Agregar vehículo</Button>
        </div>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="glass-panel rounded-3xl p-5">
            <div className="relative mb-4 h-44 w-full overflow-hidden rounded-2xl border border-slate-700/70">
              <Image src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} fill className="object-cover" unoptimized />
            </div>
            <h2 className="text-xl font-semibold">
              {vehicle.make} {vehicle.model}
            </h2>
            <p className="text-sm text-slate-300">
              {vehicle.year} · {vehicle.plate || "Sin matrícula"}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-2">
                <p className="text-xs text-slate-400">Entradas</p>
                <p className="font-semibold text-white">{vehicle.eventsCount}</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-2">
                <p className="text-xs text-slate-400">Verificados</p>
                <p className="font-semibold text-white">{vehicle.verifiedCount}</p>
              </div>
            </div>
            <div className="mt-3">
              <BadgePills badges={vehicle.badges} />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button asChild size="sm" className="w-full">
                <Link href={`/vehiculos/${vehicle.id}`}>
                  <FileText className="mr-1.5 h-4 w-4" />
                  Historial
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="w-full">
                <Link href={`/vehiculos/${vehicle.id}/eventos/nuevo`}>
                  <Wrench className="mr-1.5 h-4 w-4" />
                  Evento
                </Link>
              </Button>
              <TransferVehicleAction className="w-full" vehicleId={vehicle.id} vehicleLabel={`${vehicle.make} ${vehicle.model}`} />
              <DeleteVehicleAction className="w-full" vehicleId={vehicle.id} vehicleLabel={`${vehicle.make} ${vehicle.model}`} />
            </div>
          </Card>
        ))}
      </section>

      {status ? <p className="rounded-xl border border-cyan-300/35 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">{status}</p> : null}
    </div>
  );
}
