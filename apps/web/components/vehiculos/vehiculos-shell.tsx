"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { GalleryBanner } from "@/components/vehiculos/gallery-banner";
import { FilterChips } from "@/components/vehiculos/filter-chips";
import { VehicleCard } from "@/components/vehiculos/vehicle-card";
import { VehicleGridSkeleton } from "@/components/vehiculos/vehicle-grid-skeleton";
import { EmptyState } from "@/components/vehiculos/empty-state";
import { sectionReveal, sectionRevealReduced, staggerContainer, staggerContainerReduced, staggerItem, staggerItemReduced } from "@/lib/motion";
import { featuredVehiclesMock } from "@/lib/mock-data";

type FilterValue = "all" | "verified" | "contact";

export function VehiculosShell() {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 560);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    let results = featuredVehiclesMock.filter((vehicle) => {
      if (!normalized) return true;
      return [vehicle.plate, vehicle.make, vehicle.model, String(vehicle.year)].some((value) =>
        value.toLowerCase().includes(normalized)
      );
    });

    if (filter === "verified") {
      results = results.filter((vehicle) => vehicle.verified);
    }

    if (filter === "contact") {
      results = results.filter((vehicle) => vehicle.hasContact);
    }

    return results;
  }, [filter, query]);

  return (
    <div className="space-y-4 pb-8 md:space-y-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={reduceMotion ? sectionRevealReduced : sectionReveal}
      >
        <GalleryBanner query={query} onQueryChange={setQuery} />
      </motion.div>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={reduceMotion ? sectionRevealReduced : sectionReveal}
        className="kc-panel rounded-[1.5rem] p-4 md:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterChips value={filter} onChange={setFilter} />
          <p className="text-sm text-slate-400">{loading ? "Cargando publicaciones..." : `${filtered.length} resultados`}</p>
        </div>

        <div className="mt-4">
          {loading ? (
            <VehicleGridSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No encontramos resultados"
              description="Probá otro filtro o ajustá la búsqueda para encontrar más vehículos."
            />
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={reduceMotion ? staggerContainerReduced : staggerContainer}
              className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
            >
              {filtered.map((vehicle) => (
                <motion.div key={vehicle.id} variants={reduceMotion ? staggerItemReduced : staggerItem}>
                  <VehicleCard vehicle={vehicle} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
