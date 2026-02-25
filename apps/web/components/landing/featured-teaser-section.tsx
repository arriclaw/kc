"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Phone, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cardLift, cardLiftReduced, sectionReveal, sectionRevealReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";
import { featuredVehiclesMock } from "@/lib/mock-data";

export function FeaturedTeaserSection() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={reduceMotion ? sectionRevealReduced : sectionReveal}
      className="kc-panel rounded-[1.75rem] p-6 md:p-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="kc-overline">Destacados</p>
          <h2 className="text-3xl font-black leading-tight md:text-5xl">Unidades con historial activo</h2>
        </div>
        <Button asChild variant="outline">
          <Link href="/vehiculos">Ver todos</Link>
        </Button>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={reduceMotion ? staggerContainerReduced : staggerContainer}
        className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3"
      >
        {featuredVehiclesMock.slice(0, 6).map((vehicle) => (
          <motion.div key={vehicle.id} variants={reduceMotion ? staggerItemReduced : staggerItem}>
            <motion.article
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={reduceMotion ? cardLiftReduced : cardLift}
              className="overflow-hidden rounded-2xl border border-slate-700/75 bg-slate-900/45"
            >
              <div className="relative h-44">
                <Image src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent" />
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{vehicle.plate}</p>
                  <h3 className="text-2xl font-black text-white">
                    {vehicle.make} {vehicle.model}
                  </h3>
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
                  <span className="kc-status-chip">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {vehicle.entries} entradas
                  </span>
                </div>

                <Button asChild className="w-full">
                  <Link href="/vehiculos">Ver publicación</Link>
                </Button>
              </div>
            </motion.article>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
