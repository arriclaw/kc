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
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 12, 0], opacity: [0.35, 0.62, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="mx-auto max-w-3xl text-center">
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
