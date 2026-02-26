"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CircleCheck, FileCheck2, ShieldCheck, Signature } from "lucide-react";
import { sectionReveal, sectionRevealReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";

const cards = [
  {
    icon: FileCheck2,
    title: "Particular",
    subtitle: "Tu auto gana claridad cuando sostenés su recorrido real.",
    points: ["Respaldo claro en cada consulta", "Menos regateo por incertidumbre", "Cierre más ágil y mejor señal"]
  },
  {
    icon: ShieldCheck,
    title: "Automotora",
    subtitle: "Más rotación con unidades que transmiten confianza real.",
    points: ["Trazabilidad consistente por unidad", "Menos objeciones en operación", "Más cierres con señal clara"]
  },
  {
    icon: Signature,
    title: "Taller",
    subtitle: "Tu trabajo suma valor cuando queda bien registrado.",
    points: ["Services y reparaciones con soporte", "Origen visible en cada registro", "Más confianza en la operación"]
  }
];

export function SolutionSection() {
  const reduceMotion = !!useReducedMotion();

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={reduceMotion ? sectionRevealReduced : sectionReveal}
      className="kc-panel rounded-[1.75rem] p-6 md:p-8"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -14, 0], y: [0, 10, 0], opacity: [0.45, 0.78, 0.45] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="space-y-3">
        <h2 className="text-3xl font-black leading-tight md:text-5xl">Tres actores, una misma historia confiable</h2>
        <p className="max-w-5xl text-base text-slate-300 md:text-lg">
          El auto no habla solo: lo hacen los registros de quien lo usa, lo vende y lo mantiene.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={reduceMotion ? staggerContainerReduced : staggerContainer}
        className="mt-6 grid gap-4 md:grid-cols-3"
      >
        {cards.map((card) => (
          <motion.article
            key={card.title}
            variants={reduceMotion ? staggerItemReduced : staggerItem}
            className="kc-theme-card flex h-full flex-col rounded-2xl border p-4"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/45 bg-emerald-400/10 text-emerald-300">
              <card.icon className="h-4 w-4" />
            </div>
            <div className="mt-3 min-h-[74px]">
              <h3 className="text-xl font-bold text-[hsl(var(--text))]">{card.title}</h3>
              <p className="mt-1 text-sm text-[hsl(var(--muted))]">{card.subtitle}</p>
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
