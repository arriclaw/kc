"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Car, FileWarning, Gauge } from "lucide-react";
import { sectionReveal, sectionRevealReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";

const points = [
  {
    icon: Gauge,
    title: "Quien compra duda",
    description: "Sin registros consistentes, kilometraje, uso y estado real quedan abiertos."
  },
  {
    icon: Car,
    title: "Quien vende cede precio",
    description: "Si no hay respaldo claro, baja la señal comercial y sube el regateo."
  },
  {
    icon: FileWarning,
    title: "La operación se frena",
    description: "Sin continuidad entre particular, automotora y taller, el cierre se demora."
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
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl"
        animate={reduceMotion ? undefined : { x: [-8, 10, -8], y: [0, 10, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="space-y-3">
        <h2 className="text-3xl font-black leading-tight md:text-5xl">El valor del auto también se construye con hechos</h2>
        <p className="text-base text-slate-300 md:text-lg">
          Cuando faltan hechos registrados, todos negocian con más fricción.
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
        Cada registro consistente mejora la lectura del auto y la calidad de la decisión.
      </div>
    </motion.section>
  );
}
