"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgePills } from "@/components/vehicle/badge-pills";
import { TransferVehicleAction } from "@/components/vehicle/transfer-vehicle-action";
import { DeleteVehicleAction } from "@/components/vehicle/delete-vehicle-action";

type BadgeItem = {
  badgeType: string;
};

type GarageVehicleCardProps = {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string | null;
  imageUrl: string;
  badges: BadgeItem[];
  eventsCount: number;
  verifiedCount: number;
  lastEventTitle?: string;
  lastEventDate?: string;
  noEventsCopy: string;
};

export function GarageVehicleCard({
  id,
  make,
  model,
  year,
  plate,
  imageUrl,
  badges,
  eventsCount,
  verifiedCount,
  lastEventTitle,
  lastEventDate,
  noEventsCopy
}: GarageVehicleCardProps) {
  return (
    <Card className="glass-panel rounded-3xl p-5">
      <div className="relative mb-4 h-44 w-full overflow-hidden rounded-2xl border border-slate-700/70">
        <Image src={imageUrl} alt={`${make} ${model}`} fill className="object-cover" unoptimized />
      </div>

      <h2 className="text-xl font-semibold">
        {make} {model}
      </h2>
      <p className="text-sm text-slate-300">
        {year} · {plate || "Sin matrícula"}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-2">
          <p className="text-xs text-slate-400">Entradas</p>
          <p className="font-semibold text-white">{eventsCount}</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-2">
          <p className="text-xs text-slate-400">Verificados</p>
          <p className="font-semibold text-white">{verifiedCount}</p>
        </div>
      </div>

      <div className="mt-3">
        <BadgePills badges={badges} />
      </div>

      <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900/40 p-3 text-sm">
        {lastEventTitle ? (
          <>
            <p className="font-medium">Último registro: {lastEventTitle}</p>
            <p className="text-slate-300">{lastEventDate}</p>
          </>
        ) : (
          <>
            <p className="font-medium">Sin registros todavía</p>
            <p className="text-slate-300">{noEventsCopy}</p>
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button asChild size="sm" className="w-full">
          <Link href={`/vehiculos/${id}`}>
            <FileText className="mr-1.5 h-4 w-4" />
            Historial
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link href={`/vehiculos/${id}/eventos/nuevo`}>
            <Wrench className="mr-1.5 h-4 w-4" />
            Evento
          </Link>
        </Button>
        <TransferVehicleAction className="w-full" vehicleId={id} vehicleLabel={`${make} ${model}`} />
        <DeleteVehicleAction className="w-full" vehicleId={id} vehicleLabel={`${make} ${model}`} />
      </div>
    </Card>
  );
}
