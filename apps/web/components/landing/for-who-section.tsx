"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Building2, CarFront, CircleCheck, Wrench } from "lucide-react";
import { sectionReveal, sectionRevealReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";

const audienceCards = [
  {
    id: "particular",
    icon: CarFront,
    title: "Particular",
    subtitle: "Tu auto vale más cuando podés mostrar su recorrido real",
    points: ["Respaldo claro en cada consulta", "Menos regateo por incertidumbre", "Cierre más ágil y con señal comercial"]
  },
  {
    id: "automotora",
    icon: Building2,
    title: "Automotora",
    subtitle: "Más rotación con unidades que transmiten confianza real",
    points: ["Trazabilidad consistente por unidad", "Menos objeciones en cada operación", "Más cierres con señal comercial clara"]
  },
  {
    id: "taller",
    icon: Wrench,
    title: "Taller",
    subtitle: "Tu trabajo también construye valor comercial para el auto",
    points: ["Cargá services y reparaciones reales", "Quedá visible como origen del registro", "Sumá confianza en cada operación"]
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
        className="mt-6 grid gap-4 lg:grid-cols-3"
      >
        {audienceCards.map((card) => (
          <motion.article
            key={card.id}
            variants={reduceMotion ? staggerItemReduced : staggerItem}
            className="kc-theme-card flex h-full flex-col rounded-2xl border p-4"
          >
            <div className="flex items-center gap-3">
              <span className="kc-icon-strong inline-flex h-10 w-10 items-center justify-center rounded-xl border">
                <card.icon className="h-4 w-4" />
              </span>
              <div className="min-h-[62px]">
                <p className="text-xl font-bold text-[hsl(var(--text))]">{card.title}</p>
                <p className="text-sm text-[hsl(var(--muted))]">{card.subtitle}</p>
              </div>
            </div>

            <div className="kc-theme-subcard mt-4 flex-1 space-y-2 rounded-xl border p-3">
              {card.points.map((point) => (
                <p key={point} className="flex items-start gap-2 text-sm text-[hsl(var(--muted))]">
                  <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
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
