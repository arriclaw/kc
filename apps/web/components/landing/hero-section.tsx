"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BadgeCheck, CheckCircle2, Search, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buttonLift, buttonLiftReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";
import { demoRecords } from "@/lib/mock-data";

const heroBullets = [
  "Eventos con evidencia",
  "Transferencias registradas",
  "Menos riesgo al comprar",
  "Más valor al vender"
];

export function HeroSection() {
  const [audience, setAudience] = useState<"particular" | "automotora">("particular");
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yA = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-10, 12]);
  const yB = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [8, -10]);

  const activeRecord = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return demoRecords[0];

    return (
      demoRecords.find(
        (record) =>
          record.plate.toLowerCase().includes(normalized) ||
          record.vin.toLowerCase().includes(normalized) ||
          record.model.toLowerCase().includes(normalized)
      ) || demoRecords[0]
    );
  }, [query]);

  function scrollToExample() {
    document.getElementById("ejemplo")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <section ref={containerRef} className="kc-panel rounded-[2rem] p-6 md:p-10">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1.04fr_0.96fr]">
        <div className="space-y-6">
          <div className="kc-chip inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Infraestructura de confianza vehicular
          </div>

          <h1 className="max-w-2xl text-5xl font-black leading-[0.92] tracking-[-0.03em] md:text-7xl">
            Historial claro del auto,
            <br />
            <span className="text-emerald-400">sin verso.</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-slate-300 md:text-xl">
            Un registro verificable de servicios, transferencias e incidentes, con evidencia cuando importa.
          </p>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={reduceMotion ? staggerContainerReduced : staggerContainer}
            className="grid gap-2 text-sm text-slate-200 sm:grid-cols-2 sm:text-base"
          >
            {heroBullets.map((bullet) => (
              <motion.li key={bullet} variants={reduceMotion ? staggerItemReduced : staggerItem} className="inline-flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>{bullet}</span>
              </motion.li>
            ))}
          </motion.ul>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <motion.div variants={reduceMotion ? buttonLiftReduced : buttonLift} initial="rest" whileHover="hover" whileTap="tap">
                <Button asChild size="lg" className="h-12 px-7 text-base">
                  <Link href="/vehiculos" className="inline-flex items-center gap-2">
                    Buscar un vehículo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div variants={reduceMotion ? buttonLiftReduced : buttonLift} initial="rest" whileHover="hover" whileTap="tap">
                <Button type="button" size="lg" variant="outline" className="h-12 px-6" onClick={scrollToExample}>
                  Ver ejemplo real
                </Button>
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Tipo de perfil">
              <button
                type="button"
                role="tab"
                aria-selected={audience === "particular"}
                aria-pressed={audience === "particular"}
                onClick={() => setAudience("particular")}
                className={`kc-toggle ${audience === "particular" ? "kc-toggle--active" : ""}`}
              >
                Particular
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={audience === "automotora"}
                aria-pressed={audience === "automotora"}
                onClick={() => setAudience("automotora")}
                className={`kc-toggle ${audience === "automotora" ? "kc-toggle--active" : ""}`}
              >
                Automotora
              </button>
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-slate-700/70 bg-slate-900/35 p-4">
            <label htmlFor="demo-search" className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
              Demo interactiva
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="demo-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ingresá matrícula o VIN"
                className="h-11 pl-10"
              />
            </div>
            <p className="text-xs text-slate-400">Registro verificable • Eventos con evidencia • Historial compartible</p>
          </div>
        </div>

        <div className="relative min-h-[520px] overflow-hidden rounded-[1.75rem] border border-slate-700/65">
          <motion.div style={{ y: yA }} className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80"
              alt="Auto en entorno urbano"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
          <motion.div style={{ y: yB }} className="absolute inset-0 bg-gradient-to-t from-slate-950/84 via-slate-900/42 to-slate-900/25" />

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-4 bottom-4 rounded-2xl border border-slate-600/65 bg-slate-950/88 p-4 shadow-[0_14px_40px_rgba(2,6,23,0.45)] backdrop-blur-md"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Historial claro</p>
            <p className="mt-1 text-lg font-bold text-white">{activeRecord.model}</p>
            <p className="text-sm text-slate-300">{activeRecord.plate}</p>

            <div className="mt-3 space-y-2">
              {activeRecord.events.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{event.title}</p>
                    <p className="text-xs text-slate-400">{event.date}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {event.verified ? <span className="kc-status-chip kc-status-chip--ok">Verificado</span> : null}
                    {event.evidence ? <span className="kc-status-chip">Con evidencia</span> : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="kc-mini-metric">
                <p className="text-[11px] text-slate-400">Transparencia</p>
                <p className="text-sm font-semibold text-emerald-300">{activeRecord.transparency}</p>
              </div>
              <div className="kc-mini-metric">
                <p className="text-[11px] text-slate-400">Riesgo</p>
                <p className="text-sm font-semibold text-cyan-300">{activeRecord.risk}</p>
              </div>
              <div className="kc-mini-metric">
                <p className="text-[11px] text-slate-400">Confianza</p>
                <p className="text-sm font-semibold text-white">{activeRecord.confidence}%</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
