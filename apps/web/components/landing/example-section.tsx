"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, ChevronDown, CircleDashed, FileCheck2, ShieldAlert, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { sectionReveal, sectionRevealReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";
import { demoRecords } from "@/lib/mock-data";

function statusLabel(verified: boolean, evidence: boolean) {
  if (verified && evidence) return "Verificado · Evidencia";
  if (verified) return "Verificado";
  if (evidence) return "Con evidencia";
  return "Declarado";
}

export function ExampleSection() {
  const reduceMotion = useReducedMotion();
  const record = demoRecords[0];

  const [openEventId, setOpenEventId] = useState(record.events[0]?.id ?? "");

  const activeEvent = useMemo(
    () => record.events.find((event) => event.id === openEventId) ?? record.events[0],
    [openEventId, record.events]
  );

  const trustScore = useMemo(() => {
    if (!activeEvent) return 0;
    let score = 58;
    if (activeEvent.verified) score += 22;
    if (activeEvent.evidence) score += 14;
    return Math.min(score, 96);
  }, [activeEvent]);

  const risk = trustScore >= 85 ? "Bajo" : trustScore >= 70 ? "Medio" : "Alto";
  const transparency = trustScore >= 82 ? "Alta" : trustScore >= 68 ? "Media" : "Limitada";

  return (
    <motion.section
      id="ejemplo"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={reduceMotion ? sectionRevealReduced : sectionReveal}
      className="kc-panel scroll-mt-28 rounded-[1.75rem] p-6 md:p-8"
    >
      <div className="space-y-3">
        <p className="kc-overline">Ejemplo real</p>
        <h2 className="text-3xl font-black leading-tight md:text-5xl">Un historial que podés auditar en segundos</h2>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={reduceMotion ? staggerContainerReduced : staggerContainer}
          className="space-y-2"
        >
          {record.events.map((event) => {
            const expanded = openEventId === event.id;
            return (
              <motion.article
                key={event.id}
                variants={reduceMotion ? staggerItemReduced : staggerItem}
                className="overflow-hidden rounded-2xl border border-slate-700/75 bg-slate-900/45"
              >
                <button
                  type="button"
                  onClick={() => setOpenEventId(event.id)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                  aria-expanded={expanded}
                >
                  <div>
                    <p className="text-lg font-semibold text-white">{event.title}</p>
                    <p className="text-sm text-slate-400">{event.date} • {event.source}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`kc-status-chip ${event.verified ? "kc-status-chip--ok" : "kc-status-chip--warn"}`}>
                      {event.verified ? <BadgeCheck className="h-3.5 w-3.5" /> : <CircleDashed className="h-3.5 w-3.5" />}
                      {statusLabel(event.verified, event.evidence)}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-slate-300 transition-transform ${expanded ? "rotate-180" : ""}`} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0.16 : 0.28, ease: "easeOut" }}
                      className="px-4 pb-4"
                    >
                      <div className="rounded-xl border border-slate-700/70 bg-slate-950/60 p-3 text-sm text-slate-300">
                        {event.details}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-slate-700/75 bg-slate-900/50 p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Panel de lectura</p>
          <h3 className="mt-2 text-2xl font-black text-white">{activeEvent?.title}</h3>
          <p className="text-sm text-slate-300">{activeEvent?.source} • {activeEvent?.date}</p>

          <div className="mt-4 space-y-2">
            <div className="kc-mini-metric">
              <p className="text-xs text-slate-400">Transparencia</p>
              <p className="text-lg font-bold text-emerald-300">{transparency}</p>
            </div>
            <div className="kc-mini-metric">
              <p className="text-xs text-slate-400">Riesgo</p>
              <p className="text-lg font-bold text-cyan-300">{risk}</p>
            </div>
            <div className="kc-mini-metric">
              <p className="text-xs text-slate-400">Confianza</p>
              <p className="text-lg font-bold text-white">{trustScore}%</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-700/70 bg-slate-950/60 p-3 text-sm text-slate-300">
            <div className="flex items-center gap-2 text-slate-200">
              {trustScore >= 80 ? <ShieldCheck className="h-4 w-4 text-emerald-300" /> : <ShieldAlert className="h-4 w-4 text-amber-300" />}
              Señal principal
            </div>
            <p className="mt-2">
              {trustScore >= 80
                ? "Historial consistente con respaldo verificable en eventos críticos."
                : "El historial requiere validaciones adicionales antes de cerrar la operación."}
            </p>
          </div>

          <div className="mt-3 flex gap-2">
            <span className="kc-status-chip kc-status-chip--ok">
              <FileCheck2 className="h-3.5 w-3.5" />
              Verificado
            </span>
            <span className="kc-status-chip">Con evidencia</span>
          </div>
        </motion.aside>
      </div>
    </motion.section>
  );
}
