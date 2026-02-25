"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80",
    alt: "Sedán de gama media en ciudad"
  },
  {
    src: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80",
    alt: "SUV de gama media alta en ruta"
  },
  {
    src: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1600&q=80",
    alt: "Hatchback moderno de uso diario"
  }
];

type HeroCarouselProps = {
  className?: string;
};

export function HeroCarousel({ className }: HeroCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-10, 10]);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3400);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full overflow-hidden rounded-[2rem] border border-slate-700/80 shadow-[0_20px_50px_rgba(5,10,25,0.5)]",
        className
      )}
    >
      {slides.map((slide, i) => (
        <motion.div
          key={slide.src}
          style={{ y }}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: reduce ? 0.22 : 0.68, ease: "easeInOut" }}
          className="absolute inset-0"
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            width={1400}
            height={900}
            className="h-full w-full object-cover"
            priority={i === 0}
          />
        </motion.div>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-slate-950/65 via-slate-950/42 to-slate-950/18" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/18 to-slate-950/8" />
      <div className="relative h-full min-h-[360px] sm:min-h-[430px] lg:min-h-[500px]" />
    </div>
  );
}
