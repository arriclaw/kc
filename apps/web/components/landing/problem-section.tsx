"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Car, FileWarning, Gauge } from "lucide-react";
import { sectionReveal, sectionRevealReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";

const points = [
  {
    icon: Gauge,
    title: "Riesgo para quien compra",
    description: "Sin trazabilidad, el kilometraje y el desgaste real quedan en duda."
  },
  {
    icon: Car,
    title: "Menos fuerza para quien vende",
    description: "Sin respaldo verificable, el valor percibido cae y la negociación se vuelve cuesta arriba."
  },
  {
    icon: FileWarning,
    title: "Fricción en cada operación",
    description: "Cuando papeles, transferencias y eventos no son consistentes, el cierre se demora."
  }
];

export function ProblemSection() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={reduceMotion ? sectionRevealReduced : sectionReveal}
      className="kc-panel rounded-[1.75rem] p-6 md:p-8"
    >
      <div className="max-w-4xl space-y-3">
        <h2 className="text-3xl font-black leading-tight md:text-5xl">Sin evidencia, todos negocian a ciegas</h2>
        <p className="text-base text-slate-300 md:text-lg">
          Sin trazabilidad verificable, quien compra asume riesgo y quien vende pierde fuerza para sostener valor.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={reduceMotion ? staggerContainerReduced : staggerContainer}
        className="mt-6 grid gap-4 md:grid-cols-3"
      >
        {points.map((point) => (
          <motion.article
            key={point.title}
            variants={reduceMotion ? staggerItemReduced : staggerItem}
            className="rounded-2xl border border-slate-700/70 bg-slate-900/40 p-4"
          >
            <div className="kc-problem-icon inline-flex h-10 w-10 items-center justify-center rounded-xl border">
              <point.icon className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">{point.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{point.description}</p>
          </motion.article>
        ))}
      </motion.div>

      <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/35 px-3 py-2 text-sm text-slate-300">
        <AlertTriangle className="kc-problem-alert h-4 w-4" />
        La incertidumbre no se corrige con relato: se reduce con evidencia.
      </div>
    </motion.section>
  );
}
