"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Car, FileWarning, Gauge } from "lucide-react";
import { sectionReveal, sectionRevealReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";

const points = [
  {
    icon: Gauge,
    title: "Odómetro maquillado",
    description: "Sin contexto real, los kilómetros pueden no cerrar con el uso declarado."
  },
  {
    icon: Car,
    title: "Choques minimizados",
    description: "Muchos arreglos quedan fuera del relato cuando no hay evidencia trazable."
  },
  {
    icon: FileWarning,
    title: "Dueños y papeles difusos",
    description: "Transferencias y documentación incompleta generan fricción al momento de decidir."
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
      <div className="max-w-3xl space-y-3">
        <h2 className="text-3xl font-black leading-tight md:text-5xl">Comprar usado es comprar incertidumbre</h2>
        <p className="text-base text-slate-300 md:text-lg">
          Y vender sin historial también te resta valor. Cuando faltan hechos, pagás el riesgo vos.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={reduceMotion ? staggerContainerReduced : staggerContainer}
        className="mt-6 grid gap-3 md:grid-cols-3"
      >
        {points.map((point) => (
          <motion.article
            key={point.title}
            variants={reduceMotion ? staggerItemReduced : staggerItem}
            className="rounded-2xl border border-slate-700/70 bg-slate-900/40 p-4"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-300">
              <point.icon className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">{point.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{point.description}</p>
          </motion.article>
        ))}
      </motion.div>

      <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/35 px-3 py-2 text-sm text-slate-300">
        <AlertTriangle className="h-4 w-4 text-amber-300" />
        La incertidumbre no se elimina con promesas: se reduce con evidencia.
      </div>
    </motion.section>
  );
}
