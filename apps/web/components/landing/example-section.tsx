"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { AlertTriangle, BadgeCheck, ChevronDown, CircleDashed, FileCheck2, ShieldCheck, TrendingUp } from "lucide-react";
import { useMemo, useRef, useState } from "react";
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
  const metricsRef = useRef<HTMLDivElement | null>(null);
  const metricsInView = useInView(metricsRef, { once: true, amount: 0.4 });

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
        <h2 className="text-3xl font-black leading-tight md:text-5xl">Consistencia que se puede comprobar</h2>
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
                className="kc-theme-card overflow-hidden rounded-2xl border"
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
                    <div className="kc-theme-subcard rounded-xl border p-3 text-sm text-slate-300">
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
          className="kc-theme-card rounded-2xl border p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Lectura comercial</p>
          <h3 className="mt-2 text-2xl font-black text-white">{activeEvent?.title}</h3>
          <p className="text-sm text-slate-300">{activeEvent?.source} • {activeEvent?.date}</p>

          <div ref={metricsRef} className="mt-4 space-y-2.5">
            <div className="kc-metric-card">
              <div className="flex items-center justify-between">
                <p className="inline-flex items-center gap-1.5 text-sm text-slate-300">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Transparencia
                </p>
                <p className="text-xl font-black text-emerald-300">{transparency}</p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-800/90">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: metricsInView ? `${trustScore}%` : 0 }}
                  transition={{ duration: reduceMotion ? 0.12 : 0.7, ease: "easeOut" }}
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                />
              </div>
            </div>

            <div className="kc-metric-card">
              <div className="flex items-center justify-between">
                <p className="inline-flex items-center gap-1.5 text-sm text-slate-300">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  Riesgo
                </p>
                <p className={`text-xl font-black ${risk === "Bajo" ? "text-emerald-300" : "text-rose-300"}`}>{risk}</p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-800/90">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: metricsInView ? `${Math.max(8, 100 - trustScore)}%` : 0 }}
                  transition={{ duration: reduceMotion ? 0.12 : 0.7, ease: "easeOut" }}
                  className="h-2 rounded-full bg-gradient-to-r from-rose-400 to-amber-300"
                />
              </div>
            </div>

            <div className="kc-metric-card">
              <div className="flex items-center justify-between">
                <p className="inline-flex items-center gap-1.5 text-sm text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-cyan-500" />
                  Confianza
                </p>
                <p className="text-2xl font-black text-cyan-300">{trustScore}%</p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-800/90">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: metricsInView ? `${trustScore}%` : 0 }}
                  transition={{ duration: reduceMotion ? 0.12 : 0.7, ease: "easeOut" }}
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-400"
                />
              </div>
            </div>
          </div>

          <div className="kc-theme-subcard mt-4 rounded-xl border p-3 text-sm text-slate-300">
            <div className="flex items-center gap-2 text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Señal comercial
            </div>
            <p className="mt-2">
              {trustScore >= 80
                ? "Consistencia verificable en eventos críticos: reduce dudas y mejora el cierre."
                : "Hay señales parciales: conviene validar más antes de decidir precio o cierre."}
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
