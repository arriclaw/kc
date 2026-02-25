"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { GalleryBanner } from "@/components/vehiculos/gallery-banner";
import { FilterChips } from "@/components/vehiculos/filter-chips";
import { VehicleCard, type CatalogVehicleCard } from "@/components/vehiculos/vehicle-card";
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
  const [vehicles, setVehicles] = useState<CatalogVehicleCard[]>(
    featuredVehiclesMock.map((vehicle) => ({
      ...vehicle,
      contact: vehicle.hasContact
        ? {
            displayName: "Contacto registrado",
            phone: "+59891234567",
            whatsapp: "+59891234567",
            email: "contacto@kilometroclaro.uy"
          }
        : null
    }))
  );

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const response = await fetch("/api/catalog/vehicles", { cache: "no-store" });
        if (!response.ok) throw new Error("Catalog fetch failed");

        const data = (await response.json()) as Array<{
          id: string;
          plate: string | null;
          make: string;
          model: string;
          year: number;
          eventsCount: number;
          verifiedCount: number;
          imageUrl: string;
          contact: {
            displayName?: string | null;
            email?: string | null;
            phone?: string | null;
            whatsapp?: string | null;
          } | null;
        }>;

        if (!active) return;
        setVehicles(
          data.map((vehicle) => ({
            id: vehicle.id,
            plate: vehicle.plate || "Sin matrícula",
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            imageUrl: vehicle.imageUrl,
            entries: vehicle.eventsCount,
            verified: vehicle.verifiedCount > 0,
            hasContact: Boolean(vehicle.contact?.phone || vehicle.contact?.email || vehicle.contact?.whatsapp),
            contact: vehicle.contact
          }))
        );
      } catch {
        // Keep deterministic local fallback when API is unavailable.
      } finally {
        if (active) setLoading(false);
      }
    }, 560);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    let results = vehicles.filter((vehicle) => {
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
  }, [filter, query, vehicles]);

  return (
    <div className="space-y-5 pb-10 md:space-y-7">
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
        className="kc-panel rounded-[1.5rem] p-5 md:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterChips value={filter} onChange={setFilter} />
          <p className="text-sm text-slate-400">{loading ? "Cargando publicaciones..." : `${filtered.length} resultados`}</p>
        </div>

        <div className="mt-5">
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
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
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
