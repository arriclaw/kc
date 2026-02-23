"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3400);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className={cn(
        "relative h-full overflow-hidden rounded-[2rem] border border-slate-700/80 shadow-[0_20px_60px_rgba(5,10,25,0.55)]",
        className
      )}
    >
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          width={1400}
          height={900}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          priority={i === 0}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/20 to-slate-950/5" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/28 via-transparent to-transparent" />
      <div className="relative h-full min-h-[340px] sm:min-h-[410px] lg:min-h-[460px]" />
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-1.5 w-7 rounded-full ${i === index ? "bg-cyan-200" : "bg-white/35"}`}
            aria-label={`Ir a imagen ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
