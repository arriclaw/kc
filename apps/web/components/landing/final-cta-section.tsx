"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
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
        <motion.div
          aria-hidden
          className="absolute inset-0"
          animate={reduceMotion ? undefined : { scale: [1.02, 1.06, 1.02], x: [0, -8, 0], y: [0, 6, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/vehicles/renault-megane.jpg"
            alt="Taller trabajando sobre vehículo"
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/86 via-slate-950/70 to-slate-950/84" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(16,185,129,0.18),transparent_42%),radial-gradient(circle_at_82%_88%,rgba(56,189,248,0.16),transparent_40%)]" />
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
