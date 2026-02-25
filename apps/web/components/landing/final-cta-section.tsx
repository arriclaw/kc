"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-black leading-tight md:text-5xl">Comprá con claridad. Vendé con ventaja.</h2>
        <p className="mt-3 text-base text-slate-300 md:text-lg">
          Con trazabilidad consistente, baja el riesgo de compra y sube la confianza comercial al vender.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <motion.div variants={reduceMotion ? buttonLiftReduced : buttonLift} initial="rest" whileHover="hover" whileTap="tap">
            <Button asChild size="lg" className="h-12 px-7 text-base">
              <Link href="/vehiculos" className="inline-flex items-center gap-2">
                Buscar un vehículo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={reduceMotion ? buttonLiftReduced : buttonLift} initial="rest" whileHover="hover" whileTap="tap">
            <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
              <Link href="/acceso">Crear cuenta</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
