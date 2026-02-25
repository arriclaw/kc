"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, CircleDashed, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cardLift, cardLiftReduced } from "@/lib/motion";
import { contactLinks } from "@/lib/contact";

export type CatalogVehicleCard = {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  imageUrl: string;
  verified: boolean;
  hasContact: boolean;
  entries: number;
  contact?: {
    displayName?: string | null;
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
  } | null;
};

type VehicleCardProps = { vehicle: CatalogVehicleCard };

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const reduceMotion = useReducedMotion();
  const links = contactLinks(vehicle.contact || {});
  const hasActionableContact = Boolean(links.whatsappHref || links.phoneHref || links.emailHref);

  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      animate="rest"
      {...(reduceMotion ? { variants: cardLiftReduced } : { variants: cardLift })}
      className="kc-theme-card overflow-hidden rounded-2xl border"
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
          <span className={`kc-status-chip ${vehicle.verified ? "kc-status-chip--ok" : "kc-status-chip--warn"}`}>
            {vehicle.verified ? <BadgeCheck className="h-3.5 w-3.5" /> : <CircleDashed className="h-3.5 w-3.5" />}
            {vehicle.verified ? "Verificado" : "Sin verificar"}
          </span>
          <span className={`kc-status-chip ${vehicle.hasContact ? "" : "kc-status-chip--warn"}`}>
            <Phone className="h-3.5 w-3.5" />
            {vehicle.hasContact ? "Contacto disponible" : "Sin contacto"}
          </span>
          <span className="kc-status-chip">
            <ShieldCheck className="h-3.5 w-3.5" />
            {vehicle.entries} entradas
          </span>
        </div>

        <Button asChild className="w-full">
          <Link href={`/vehiculos/${vehicle.id}`}>Ver publicación</Link>
        </Button>

        {hasActionableContact ? (
          <div className="grid grid-cols-3 gap-2">
            {links.whatsappHref ? (
              <Button asChild size="sm" variant="outline" className="h-9 px-0 text-xs">
                <a href={links.whatsappHref} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="h-9 px-0 text-xs" disabled>
                <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                WhatsApp
              </Button>
            )}
            {links.phoneHref ? (
              <Button asChild size="sm" variant="outline" className="h-9 px-0 text-xs">
                <a href={links.phoneHref}>
                  <Phone className="mr-1.5 h-3.5 w-3.5" />
                  Llamar
                </a>
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="h-9 px-0 text-xs" disabled>
                <Phone className="mr-1.5 h-3.5 w-3.5" />
                Llamar
              </Button>
            )}
            {links.emailHref ? (
              <Button asChild size="sm" variant="outline" className="h-9 px-0 text-xs">
                <a href={links.emailHref}>
                  <Mail className="mr-1.5 h-3.5 w-3.5" />
                  Mail
                </a>
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="h-9 px-0 text-xs" disabled>
                <Mail className="mr-1.5 h-3.5 w-3.5" />
                Mail
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
