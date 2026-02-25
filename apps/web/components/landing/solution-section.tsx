"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { FileCheck2, ShieldCheck, Signature } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { sectionReveal, sectionRevealReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";

function useCountUp(target: number, start: boolean, reduced: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setValue(target);
      return;
    }

    let frame = 0;
    const duration = 900;
    const startAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startAt) / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, reduced]);

  return value;
}

const cards = [
  {
    icon: FileCheck2,
    title: "Eventos estructurados",
    description: "Cada service, reparación o incidente queda con fecha, origen y contexto."
  },
  {
    icon: ShieldCheck,
    title: "Fuente y nivel de confianza",
    description: "Mostramos si fue autodeclarado o verificado por tercero con claridad."
  },
  {
    icon: Signature,
    title: "Evidencia adjunta",
    description: "Facturas, comprobantes e inspecciones para auditar sin adivinar."
  }
];

export function SolutionSection() {
  const reduceMotion = !!useReducedMotion();
  const counterRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(counterRef, { once: true, amount: 0.4 });

  const confidence = useCountUp(94, Boolean(inView), reduceMotion);
  const coverage = useCountUp(82, Boolean(inView), reduceMotion);
  const traceability = useCountUp(97, Boolean(inView), reduceMotion);

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={reduceMotion ? sectionRevealReduced : sectionReveal}
      className="kc-panel rounded-[1.75rem] p-6 md:p-8"
    >
      <div className="space-y-3">
        <p className="kc-overline">Solución</p>
        <h2 className="text-3xl font-black leading-tight md:text-5xl">Historial verificable con evidencia</h2>
        <p className="max-w-3xl text-base text-slate-300 md:text-lg">
          Verificable significa que podés revisar qué pasó, quién lo registró y con qué respaldo.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={reduceMotion ? staggerContainerReduced : staggerContainer}
        className="mt-6 grid gap-3 md:grid-cols-3"
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

      <div ref={counterRef} className="mt-6 grid gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/40 p-4 md:grid-cols-3">
        <div className="kc-counter-card">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Confianza del perfil</p>
          <p className="text-3xl font-black text-white">{confidence}%</p>
        </div>
        <div className="kc-counter-card">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Cobertura de eventos</p>
          <p className="text-3xl font-black text-white">{coverage}%</p>
        </div>
        <div className="kc-counter-card">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Trazabilidad registrada</p>
          <p className="text-3xl font-black text-white">{traceability}%</p>
        </div>
      </div>
    </motion.section>
  );
}
