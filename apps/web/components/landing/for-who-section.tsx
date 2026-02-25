"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Building2, CarFront, ChevronDown, CircleCheck } from "lucide-react";
import { useState } from "react";
import { sectionReveal, sectionRevealReduced } from "@/lib/motion";

const audienceCards = [
  {
    id: "particular",
    icon: CarFront,
    title: "Particular",
    subtitle: "Tu historial para comprar y vender mejor",
    points: ["Cargá services e incidentes en minutos", "Mostrá evidencia real al vender", "Transferí titularidad dentro de la plataforma"]
  },
  {
    id: "automotora",
    icon: Building2,
    title: "Automotora",
    subtitle: "Operación por unidad con señal comercial clara",
    points: ["Gestioná stock sin límite de unidades", "Publicá vehículos con contexto verificable", "Mejorá cierre comercial con menos fricción"]
  }
] as const;

export function ForWhoSection() {
  const reduceMotion = useReducedMotion();
  const [openId, setOpenId] = useState<(typeof audienceCards)[number]["id"]>("particular");

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={reduceMotion ? sectionRevealReduced : sectionReveal}
      className="kc-panel rounded-[1.75rem] p-6 md:p-8"
    >
      <div className="space-y-2">
        <p className="kc-overline">Para quién</p>
        <h2 className="text-3xl font-black leading-tight md:text-5xl">Una experiencia distinta para cada rol</h2>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        {audienceCards.map((card) => {
          const expanded = openId === card.id;
          return (
            <article key={card.id} className="rounded-2xl border border-slate-700/75 bg-slate-900/45">
              <button
                type="button"
                onClick={() => setOpenId(card.id)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between gap-4 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600/80 bg-slate-900/60 text-slate-100">
                    <card.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xl font-bold text-white">{card.title}</p>
                    <p className="text-sm text-slate-300">{card.subtitle}</p>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-300 transition-transform ${expanded ? "rotate-180" : ""}`} />
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
                    <div className="space-y-2 rounded-xl border border-slate-700/70 bg-slate-950/65 p-3">
                      {card.points.map((point) => (
                        <p key={point} className="inline-flex items-center gap-2 text-sm text-slate-200">
                          <CircleCheck className="h-4 w-4 text-emerald-300" />
                          {point}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </motion.section>
  );
}
