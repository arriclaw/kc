"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DatabaseZap, SearchCheck, Shield } from "lucide-react";
import { sectionReveal, sectionRevealReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";

const steps = [
  {
    icon: SearchCheck,
    title: "Ingresás la matrícula",
    body: "Entrás en segundos al auto y a su contexto operativo real."
  },
  {
    icon: DatabaseZap,
    title: "Cruzamos fuentes y respaldo",
    body: "Ordenamos eventos, origen y soporte en una secuencia consistente."
  },
  {
    icon: Shield,
    title: "Recibís una señal clara para decidir",
    body: "Comprás con menos riesgo y vendés con mejor posición comercial."
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
      <div className="space-y-3">
        <h2 className="text-3xl font-black leading-tight md:text-5xl">Del dato inicial a una decisión con fundamento</h2>
        <p className="max-w-5xl text-base text-slate-300 md:text-lg">
          Un flujo corto y claro: menos dudas para comprar, más respaldo para vender.
        </p>
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
            className="relative flex min-h-[198px] flex-col overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/45 p-5"
          >
            <span className="pointer-events-none absolute right-4 top-3 text-[3.9rem] font-black leading-none tracking-[-0.06em] text-cyan-200/20">
              {index + 1}
            </span>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/45 bg-cyan-400/10 text-cyan-300">
              <step.icon className="h-4 w-4" />
            </div>
            <h3 className="mt-4 max-w-[92%] text-xl font-bold text-white">{step.title}</h3>
            <p className="mt-2 max-w-[92%] text-sm leading-relaxed text-slate-300">{step.body}</p>
          </motion.li>
        ))}
      </motion.ol>
    </motion.section>
  );
}
