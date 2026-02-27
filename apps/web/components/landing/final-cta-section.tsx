"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonLift, buttonLiftReduced, sectionReveal, sectionRevealReduced } from "@/lib/motion";

export function FinalCtaSection() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={reduceMotion ? sectionRevealReduced : sectionReveal}
      className="kc-panel rounded-[1.75rem] p-6 md:p-8"
    >
      <div className="absolute inset-0 overflow-hidden rounded-[1.75rem]">
        <div className="absolute inset-0 bg-slate-950" />
        <motion.div
          aria-hidden
          className="absolute inset-0"
          animate={reduceMotion ? undefined : { scale: [1.02, 1.06, 1.02], x: [0, -8, 0], y: [0, 6, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src="https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=2200"
            alt="Lote con múltiples autos en venta"
            className="h-full w-full object-cover opacity-58 saturate-90 contrast-95 brightness-75"
            loading="lazy"
            decoding="async"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/93 via-slate-950/87 to-slate-950/92" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(16,185,129,0.18),transparent_44%),radial-gradient(circle_at_84%_86%,rgba(56,189,248,0.14),transparent_42%)]" />
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 12, 0], opacity: [0.35, 0.62, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-black leading-tight md:text-5xl">Cada vehículo tiene una historia.</h2>
        <p className="mt-3 text-base text-slate-300 md:text-lg">
          Cuando se registra bien, se vuelve clara para todos.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <motion.div variants={reduceMotion ? buttonLiftReduced : buttonLift} initial="rest" whileHover="hover" whileTap="tap">
            <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
              <Link href="/particular">Soy Particular</Link>
            </Button>
          </motion.div>

          <motion.div variants={reduceMotion ? buttonLiftReduced : buttonLift} initial="rest" whileHover="hover" whileTap="tap">
            <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
              <Link href="/dealer">Soy Automotora</Link>
            </Button>
          </motion.div>

          <motion.div variants={reduceMotion ? buttonLiftReduced : buttonLift} initial="rest" whileHover="hover" whileTap="tap">
            <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
              <Link href="/taller/onboarding">Soy Taller</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
