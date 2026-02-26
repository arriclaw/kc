"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { AlertTriangle, BadgeCheck, CheckCircle2, CircleDashed, FileCheck2, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { buttonLift, buttonLiftReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";

const heroBullets = [
  "Más certeza para comprar",
  "Más respaldo para vender",
  "Más confianza para cerrar"
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yA = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-6, 8]);
  const yB = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [10, -6]);

  return (
    <section ref={containerRef} className="kc-panel rounded-[2rem] p-6 md:p-10">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1.04fr_0.96fr]">
        <div className="space-y-6">
          <div className="kc-chip inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Infraestructura de confianza vehicular
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.03em] md:text-7xl">
            Historial claro del{" "}
            <span className="md:whitespace-nowrap">
              auto, <span className="text-emerald-400">sin verso.</span>
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-slate-300 md:text-xl">
            Un registro real, claro y continuo.
            <br className="hidden md:block" />
            Lo construyen los particulares, las automotoras y los talleres.
          </p>

          <p className="max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
            Cuando cada actor deja trazas reales, baja la duda en la compra y sube el valor percibido en la venta.
          </p>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={reduceMotion ? staggerContainerReduced : staggerContainer}
            className="grid gap-2 text-sm text-slate-200 sm:grid-cols-3 sm:text-base"
          >
            {heroBullets.map((bullet) => (
              <motion.li key={bullet} variants={reduceMotion ? staggerItemReduced : staggerItem} className="inline-flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{bullet}</span>
              </motion.li>
            ))}
          </motion.ul>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <motion.div variants={reduceMotion ? buttonLiftReduced : buttonLift} initial="rest" whileHover="hover" whileTap="tap">
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link href="/registro?role=OWNER">Soy Particular</Link>
                </Button>
              </motion.div>
              <motion.div variants={reduceMotion ? buttonLiftReduced : buttonLift} initial="rest" whileHover="hover" whileTap="tap">
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link href="/registro?role=DEALER">Soy Automotora</Link>
                </Button>
              </motion.div>
              <motion.div variants={reduceMotion ? buttonLiftReduced : buttonLift} initial="rest" whileHover="hover" whileTap="tap">
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link href="/registro?role=WORKSHOP">Soy Taller</Link>
                </Button>
              </motion.div>
            </div>
          </div>
          <p className="text-sm text-slate-400">Trazable. Con evidencia. En el tiempo.</p>
        </div>

        <div className="relative min-h-[468px] overflow-hidden rounded-[1.75rem] border border-slate-700/65 lg:min-h-[500px]">
          <motion.div style={{ y: yA }} className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(16,185,129,0.22),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.2),transparent_42%),linear-gradient(160deg,rgba(2,6,23,0.96),rgba(8,16,32,0.94))]" />
          <motion.div style={{ y: yB }} className="absolute inset-0 opacity-30">
            <Image src="/images/vehicles/renault-megane.jpg" alt="Renault Megane" fill className="object-cover" />
          </motion.div>
          <motion.div style={{ y: yA }} className="absolute inset-0 opacity-[0.18] mix-blend-screen">
            <Image src="/images/vehicles/toyota-corolla.jpg" alt="Toyota Corolla" fill className="object-cover scale-110 blur-[2px]" />
          </motion.div>
          <motion.div style={{ y: yB }} className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_30%,rgba(15,23,42,0.34))]" />
          <div className="absolute -left-12 top-12 h-44 w-44 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute -right-16 bottom-4 h-56 w-56 rounded-full bg-emerald-400/12 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="kc-hero-proof absolute inset-x-4 top-4 bottom-4 rounded-2xl border p-4 md:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Consistencia verificable</p>
                <p className="mt-1 text-lg font-bold text-white">Renault Megane 2014 • SBT2885</p>
              </div>
              <span className="kc-status-chip kc-status-chip--ok">
                <BadgeCheck className="h-3.5 w-3.5" />
                Señal alta
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {[
                { title: "Service — Particular", date: "12/2024", ok: true, evidence: false },
                { title: "Cambio de frenos — Taller García (Con evidencia)", date: "08/2024", ok: true, evidence: true },
                { title: "Ingreso a stock — Automotora", date: "03/2024", ok: false, evidence: false }
              ].map((event) => (
                <div key={event.title} className="kc-hero-proof-row flex flex-col gap-2 rounded-xl border px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{event.title}</p>
                    <p className="text-xs text-slate-400">{event.date}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {event.ok ? (
                      <span className="kc-status-chip kc-status-chip--ok">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verificado
                      </span>
                    ) : null}
                    {event.evidence ? (
                      <span className="kc-status-chip">
                        <FileCheck2 className="h-3.5 w-3.5" />
                        Con evidencia
                      </span>
                    ) : (
                      <span className="kc-status-chip">
                        <CircleDashed className="h-3.5 w-3.5" />
                        Registrada
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="kc-mini-metric">
                <p className="text-[11px] text-slate-400">Transparencia</p>
                <p className="text-sm font-semibold text-emerald-300">Alta</p>
              </div>
              <div className="kc-mini-metric">
                <p className="text-[11px] text-slate-400">Riesgo</p>
                <p className="text-sm font-semibold text-cyan-300">Bajo</p>
              </div>
              <div className="kc-mini-metric">
                <p className="text-[11px] text-slate-400">Confianza</p>
                <p className="text-sm font-semibold text-white">92%</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-700/70 bg-slate-900/45 p-3 text-sm text-slate-300">
              <p className="inline-flex items-center gap-2 text-slate-200">
                <AlertTriangle className="h-4 w-4 text-amber-300" />
                Lectura comercial
              </p>
              <p className="mt-1.5">Con continuidad entre particular, automotora y taller, baja la incertidumbre y mejora la posición de cierre.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
