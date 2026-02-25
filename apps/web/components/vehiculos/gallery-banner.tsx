"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type GalleryBannerProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function GalleryBanner({ query, onQueryChange }: GalleryBannerProps) {
  return (
    <section className="kc-panel rounded-[1.75rem] p-6 md:p-8">
      <p className="kc-overline">Galería</p>
      <h1 className="mt-2 text-4xl font-black leading-tight md:text-6xl">Unidades con evidencia verificable</h1>
      <p className="mt-3 max-w-3xl text-base text-slate-300 md:text-lg">
        Explorá vehículos con señal real para decidir con claridad al comprar o sostener mejor valor al vender.
      </p>

      <div className="relative mt-5 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar por matrícula, marca, modelo o año"
          className="h-11 pl-10"
        />
      </div>
    </section>
  );
}
