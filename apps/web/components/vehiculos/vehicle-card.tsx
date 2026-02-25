"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cardLift, cardLiftReduced } from "@/lib/motion";
import type { FeaturedVehicle } from "@/lib/mock-data";

type VehicleCardProps = {
  vehicle: FeaturedVehicle;
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      animate="rest"
      {...(reduceMotion ? { variants: cardLiftReduced } : { variants: cardLift })}
      className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/45"
    >
      <div className="relative h-48">
        <Image src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{vehicle.plate}</p>
          <h2 className="text-3xl font-black text-white">{vehicle.make} {vehicle.model}</h2>
          <p className="text-sm text-slate-300">Año {vehicle.year}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {vehicle.verified ? (
            <span className="kc-status-chip kc-status-chip--ok">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verificado
            </span>
          ) : null}
          {vehicle.hasContact ? (
            <span className="kc-status-chip">
              <Phone className="h-3.5 w-3.5" />
              Contacto
            </span>
          ) : null}
          <span className="kc-status-chip">{vehicle.entries} entradas</span>
        </div>

        <Button asChild className="w-full">
          <Link href={`/vehiculos/${vehicle.id}`}>Ver publicación</Link>
        </Button>
      </div>
    </motion.article>
  );
}
