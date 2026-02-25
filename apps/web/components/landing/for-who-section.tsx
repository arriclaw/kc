"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Building2, CarFront, CircleCheck } from "lucide-react";
import { sectionReveal, sectionRevealReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";

const audienceCards = [
  {
    id: "particular",
    icon: CarFront,
    title: "Particular",
    subtitle: "Tu historial para comprar y vender mejor",
    points: ["Cargá services e incidentes en minutos", "Mostrá evidencia real al vender", "Transferí titularidad dentro de la plataforma"]
  },
  {
    id: "automotora",
    icon: Building2,
    title: "Automotora",
    subtitle: "Operación por unidad con señal comercial clara",
    points: ["Gestioná stock sin límite de unidades", "Publicá vehículos con contexto verificable", "Mejorá cierre comercial con menos fricción"]
  }
] as const;

export function ForWhoSection() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={reduceMotion ? sectionRevealReduced : sectionReveal}
      className="kc-panel rounded-[1.75rem] p-6 md:p-8"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-black leading-tight md:text-5xl">Una experiencia distinta para cada rol</h2>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={reduceMotion ? staggerContainerReduced : staggerContainer}
        className="mt-6 grid gap-3 lg:grid-cols-2"
      >
        {audienceCards.map((card) => (
          <motion.article
            key={card.id}
            variants={reduceMotion ? staggerItemReduced : staggerItem}
            className="rounded-2xl border border-slate-700/75 bg-slate-900/45 p-4"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600/80 bg-slate-900/60 text-slate-100">
                <card.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xl font-bold text-white">{card.title}</p>
                <p className="text-sm text-slate-300">{card.subtitle}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-xl border border-slate-700/70 bg-slate-950/65 p-3">
              {card.points.map((point) => (
                <p key={point} className="inline-flex items-center gap-2 text-sm text-slate-200">
                  <CircleCheck className="h-4 w-4 text-emerald-300" />
                  {point}
                </p>
              ))}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  );
}
