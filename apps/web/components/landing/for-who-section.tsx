"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Building2, CarFront, CircleCheck } from "lucide-react";
import { sectionReveal, sectionRevealReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";

const audienceCards = [
  {
    id: "particular",
    icon: CarFront,
    title: "Particular",
    subtitle: "Tu auto vale más cuando podés demostrar su recorrido",
    points: ["Mostrás respaldo real en cada consulta", "Reducís discusión y fricción de precio", "Cerrás venta más rápido y con mejor señal"]
  },
  {
    id: "automotora",
    icon: Building2,
    title: "Automotora",
    subtitle: "Más rotación con unidades que transmiten confianza",
    points: ["Estandarizás trazabilidad por unidad", "Reducís objeciones comerciales repetidas", "Acelerás cierres con señal de confianza concreta"]
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
        <h2 className="text-3xl font-black leading-tight md:text-5xl">Confianza comercial para cada perfil</h2>
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
            className="kc-theme-card rounded-2xl border p-4"
          >
            <div className="flex items-center gap-3">
              <span className="kc-icon-strong inline-flex h-10 w-10 items-center justify-center rounded-xl border">
                <card.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xl font-bold text-white">{card.title}</p>
                <p className="text-sm text-slate-300">{card.subtitle}</p>
              </div>
            </div>

            <div className="kc-theme-subcard mt-4 space-y-2 rounded-xl border p-3">
              {card.points.map((point) => (
                <p key={point} className="inline-flex items-center gap-2 text-sm text-slate-200">
                  <CircleCheck className="h-4 w-4 text-emerald-500" />
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
