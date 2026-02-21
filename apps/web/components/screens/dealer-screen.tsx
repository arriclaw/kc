"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CarFront, PlusCircle, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { BadgePills } from "@/components/vehicle/badge-pills";

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
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const [plate, setPlate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));

  const [type, setType] = useState("SERVICE");
  const [title, setTitle] = useState("Servicio de automotora");
  const [description, setDescription] = useState("Ingreso de mantenimiento desde Mi Garage de automotora");
  const [odometer, setOdometer] = useState("");

  async function loadVehicles() {
    const response = await fetch("/api/dealer/vehicles");
    if (!response.ok) return;
    const data = (await response.json()) as DealerVehicle[];
    setVehicles(data);
  }

  useEffect(() => {
    void loadVehicles();
  }, []);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === selectedVehicleId),
    [vehicles, selectedVehicleId]
  );

  const totals = useMemo(() => {
    const entries = vehicles.reduce((acc, v) => acc + v.eventsCount, 0);
    const verified = vehicles.reduce((acc, v) => acc + v.verifiedCount, 0);
    const coverage = entries === 0 ? 0 : Math.round((verified / entries) * 100);
    return { entries, verified, coverage };
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

  async function publishEvent() {
    if (!selectedVehicle) {
      setStatus("Seleccioná un vehículo.");
      return;
    }

    const response = await fetch(`/api/dealer/vehicles/${selectedVehicle.id}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        occurredAt: new Date().toISOString(),
        title,
        description,
        odometerKm: odometer ? Number(odometer) : null,
        verificationStatus: "UNVERIFIED"
      })
    });

    setStatus(response.ok ? "Evento cargado correctamente." : "No se pudo cargar el evento.");
    if (response.ok) {
      setOdometer("");
      await loadVehicles();
    }
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
        <p className="glass-chip inline-flex text-xs font-semibold uppercase tracking-[0.14em]">Mi Garage · Automotora</p>
        <h1 className="mt-3 text-3xl font-black text-white">Operación por vehículo</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Dás de alta unidades, registrás lo que se hizo en cada auto y mantenés historial comercial claro.
        </p>
      </Card>

      <Card className="glass-panel space-y-4">
        <h2 className="inline-flex items-center gap-2 text-lg font-bold text-white">
          <PlusCircle className="h-5 w-5 text-cyan-200" />
          Agregar auto al garage
        </h2>
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
            <h2 className="text-xl font-semibold text-white">
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
            <div className="mt-4 flex gap-2">
              <Button asChild size="sm">
                <Link href={`/vehiculos/${vehicle.id}`}>Ver historial</Link>
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedVehicleId(vehicle.id)}>
                Registrar evento
              </Button>
            </div>
          </Card>
        ))}
      </section>

      <Card className="glass-panel space-y-3">
        <h2 className="inline-flex items-center gap-2 text-lg font-bold text-white">
          <Wrench className="h-5 w-5 text-cyan-200" />
          {selectedVehicle ? "Registrar evento al vehículo seleccionado" : "Seleccioná un auto para registrar evento"}
        </h2>

        {selectedVehicle ? (
          <div className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-3 text-sm text-slate-200">
            <p className="inline-flex items-center gap-2 font-semibold">
              <CarFront className="h-4 w-4 text-cyan-200" />
              {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year}) · {selectedVehicle.plate || "Sin matrícula"}
            </p>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Select value={type} onChange={(e) => setType(e.target.value)} disabled={!selectedVehicle}>
            <option value="SERVICE">Servicio</option>
            <option value="REPAIR">Reparación</option>
            <option value="INSPECTION">Inspección</option>
            <option value="ODOMETER">Odómetro</option>
            <option value="OTHER">Otro</option>
          </Select>
          <Input
            value={odometer}
            onChange={(e) => setOdometer(e.target.value)}
            type="number"
            placeholder="Odómetro km"
            disabled={!selectedVehicle}
          />
        </div>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título del evento"
          disabled={!selectedVehicle}
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
          disabled={!selectedVehicle}
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={publishEvent} disabled={!selectedVehicle}>
            Publicar evento
          </Button>
          {selectedVehicle ? (
            <Button variant="outline" onClick={() => setSelectedVehicleId(null)}>
              Limpiar selección
            </Button>
          ) : null}
        </div>
      </Card>

      {status ? <p className="rounded-xl border border-cyan-300/35 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">{status}</p> : null}
    </div>
  );
}
