"use client";

import Image from "next/image";
import Link from "next/link";
import { Activity, BadgeCheck, Mail, MessageCircle, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BadgePills } from "@/components/vehicle/badge-pills";
import { contactLinks } from "@/lib/contact";
import { VerifiedUserBadge } from "@/components/common/verified-user-badge";
import { RevealSection, StaggerContainer, StaggerItem } from "@/components/motion/reveal";

type CatalogVehicle = {
  id: string;
  plate: string | null;
  make: string;
  model: string;
  year: number;
  eventsCount: number;
  verifiedCount: number;
  badges: Array<{ badgeType: string }>;
  publicToken: string | null;
  imageUrl: string;
  contact: {
    ownerType: "OWNER" | "DEALER" | "ADMIN";
    displayName: string;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
  } | null;
};

async function fetchVehicles(params: URLSearchParams) {
  const response = await fetch(`/api/catalog/vehicles?${params.toString()}`);
  if (!response.ok) return [];
  return (await response.json()) as CatalogVehicle[];
}

export default function VehicleGalleryPage() {
  const [q, setQ] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [quickFilter, setQuickFilter] = useState<"all" | "verified" | "contact">("all");

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (make) p.set("make", make);
    if (model) p.set("model", model);
    if (year) p.set("year", year);
    return p;
  }, [q, make, model, year]);

  const { data = [], isFetching, refetch } = useQuery({
    queryKey: ["catalog-vehicles", params.toString()],
    queryFn: () => fetchVehicles(params)
  });

  const filteredData = useMemo(() => {
    if (quickFilter === "verified") {
      return data.filter((vehicle) => vehicle.verifiedCount > 0);
    }
    if (quickFilter === "contact") {
      return data.filter(
        (vehicle) =>
          !!vehicle.contact &&
          Boolean(vehicle.contact.email || vehicle.contact.phone || vehicle.contact.whatsapp)
      );
    }
    return data;
  }, [data, quickFilter]);

  return (
    <div className="space-y-6">
      <RevealSection>
        <Card className="feature-banner rounded-[2rem] p-6">
          <h1 className="text-4xl font-black leading-tight">Galería de publicaciones</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Explorá unidades con historial activo, señales de verificación y contacto directo del titular para decidir con menos
            incertidumbre.
          </p>
          <div className="mt-3 inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
            Usá el buscador para filtrar por matrícula, marca, modelo o año
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" />
            <Input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Marca" />
            <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Modelo" />
            <Input value={year} onChange={(e) => setYear(e.target.value)} type="number" placeholder="Año" />
            <Button onClick={() => refetch()}>{isFetching ? "Buscando..." : "Filtrar"}</Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setQuickFilter("all")}
              className={`filter-chip ${quickFilter === "all" ? "filter-chip--active" : ""}`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setQuickFilter("verified")}
              className={`filter-chip ${quickFilter === "verified" ? "filter-chip--active" : ""}`}
            >
              Con verificación
            </button>
            <button
              type="button"
              onClick={() => setQuickFilter("contact")}
              className={`filter-chip ${quickFilter === "contact" ? "filter-chip--active" : ""}`}
            >
              Con contacto
            </button>
          </div>
        </Card>
      </RevealSection>

      <RevealSection>
        {filteredData.length === 0 ? (
          <Card className="gallery-card rounded-3xl p-6">
            <p className="text-sm text-slate-300">No encontramos publicaciones con ese filtro.</p>
          </Card>
        ) : (
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredData.map((vehicle) => (
              <StaggerItem key={vehicle.id}>
                <Card className="gallery-card card-lift relative overflow-hidden rounded-3xl p-0">
                  <div className="relative h-56 w-full">
                    <Image
                      src={vehicle.imageUrl}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/12 to-transparent" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.13em] text-cyan-200/80">{vehicle.plate || "Sin matrícula"}</p>
                    <h2 className="mt-1 text-3xl font-black leading-tight text-white">
                      {vehicle.make} {vehicle.model}
                    </h2>
                    <p className="text-sm font-medium text-slate-300">Año {vehicle.year}</p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <div className="home-mini-chip inline-flex items-center rounded-full border border-slate-500/40 bg-slate-950/45 px-2.5 py-1 text-slate-200">
                        <Activity className="mr-1 inline h-3.5 w-3.5 text-cyan-200" />
                        Entradas: <span className="ml-1 font-bold text-white">{vehicle.eventsCount}</span>
                      </div>
                      <div className="home-mini-chip inline-flex items-center rounded-full border border-slate-500/40 bg-slate-950/45 px-2.5 py-1 text-slate-200">
                        <BadgeCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-300" />
                        Verificados: <span className="ml-1 font-bold text-white">{vehicle.verifiedCount}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <BadgePills badges={vehicle.badges} />
                    </div>

                    {vehicle.contact ? (
                      <div className="mt-3 rounded-xl border border-slate-700/70 bg-slate-900/35 p-3">
                        <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/80">
                          {vehicle.contact.ownerType === "DEALER" ? "Automotora" : "Particular"}
                        </p>
                        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                          {vehicle.contact.displayName}
                          <VerifiedUserBadge iconOnly />
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button asChild size="sm" className="w-full">
                        <Link href={`/publicaciones/${vehicle.id}`}>Ver publicación</Link>
                      </Button>
                      {vehicle.publicToken ? (
                        <Button asChild size="sm" variant="outline" className="w-full">
                          <Link href={`/publico/${vehicle.publicToken}`}>Historial</Link>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="w-full" disabled>
                          Historial
                        </Button>
                      )}
                    </div>

                    {vehicle.contact ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(() => {
                          const links = contactLinks({
                            email: vehicle.contact.email,
                            phone: vehicle.contact.phone,
                            whatsapp: vehicle.contact.whatsapp
                          });
                          return (
                            <>
                              {links.whatsappHref ? (
                                <Button asChild size="sm" variant="outline" className="whitespace-nowrap">
                                  <a href={links.whatsappHref} target="_blank" rel="noreferrer">
                                    <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                                    WhatsApp
                                  </a>
                                </Button>
                              ) : null}
                              {links.phoneHref ? (
                                <Button asChild size="sm" variant="outline" className="whitespace-nowrap">
                                  <a href={links.phoneHref}>
                                    <Phone className="mr-1.5 h-3.5 w-3.5" />
                                    Llamar
                                  </a>
                                </Button>
                              ) : null}
                              {links.emailHref ? (
                                <Button asChild size="sm" variant="outline" className="whitespace-nowrap">
                                  <a href={links.emailHref}>
                                    <Mail className="mr-1.5 h-3.5 w-3.5" />
                                    Mail
                                  </a>
                                </Button>
                              ) : null}
                            </>
                          );
                        })()}
                      </div>
                    ) : null}
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </RevealSection>
    </div>
  );
}
