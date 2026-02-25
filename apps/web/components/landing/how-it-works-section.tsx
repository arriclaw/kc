"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DatabaseZap, SearchCheck, Shield } from "lucide-react";
import { sectionReveal, sectionRevealReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";

const steps = [
  {
    icon: SearchCheck,
    title: "Ingresás matrícula o VIN",
    body: "Entrás rápido al vehículo y su contexto real."
  },
  {
    icon: DatabaseZap,
    title: "Cruzamos fuentes y evidencia",
    body: "Ordenamos eventos, origen y respaldo en una secuencia consistente."
  },
  {
    icon: Shield,
    title: "Recibís una señal clara para decidir",
    body: "Comprás con menos riesgo o vendés con más confianza comercial."
  }
];

export function HowItWorksSection() {
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
        <h2 className="text-3xl font-black leading-tight md:text-5xl">Del dato inicial a una decisión con fundamento</h2>
      </div>

      <motion.ol
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={reduceMotion ? staggerContainerReduced : staggerContainer}
        className="mt-6 grid gap-4 md:grid-cols-3"
      >
        {steps.map((step, index) => (
          <motion.li
            key={step.title}
            variants={reduceMotion ? staggerItemReduced : staggerItem}
            className="flex min-h-[248px] flex-col rounded-2xl border border-slate-700/70 bg-slate-900/45 p-4"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 text-slate-200">{index + 1}</span>
              Paso
            </div>
            <div className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-300">
              <step.icon className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">{step.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{step.body}</p>
          </motion.li>
        ))}
      </motion.ol>
    </motion.section>
  );
}
