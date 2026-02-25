"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FileCheck2, ShieldCheck, Signature } from "lucide-react";
import { sectionReveal, sectionRevealReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";

const cards = [
  {
    icon: FileCheck2,
    title: "Evidencia estructurada",
    description: "Cada service, reparación o incidente queda con fecha, origen y respaldo."
  },
  {
    icon: ShieldCheck,
    title: "Verificación y procedencia",
    description: "Se ve si el evento fue autodeclarado o validado por tercero, sin ambigüedad."
  },
  {
    icon: Signature,
    title: "Señal comercial accionable",
    description: "La consistencia del registro acelera decisiones, mejora confianza y reduce fricción."
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
      <div className="space-y-3">
        <h2 className="text-3xl font-black leading-tight md:text-5xl">Un sistema verificable para decidir y cerrar mejor</h2>
        <p className="max-w-5xl text-base text-slate-300 md:text-lg">
          Kilómetro Claro convierte datos sueltos en señales confiables: más claridad para comprar y mejor posición comercial para vender.
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
            className="rounded-2xl border border-slate-700/70 bg-slate-900/40 p-4"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/45 bg-emerald-400/10 text-emerald-300">
              <card.icon className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{card.description}</p>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  );
}
