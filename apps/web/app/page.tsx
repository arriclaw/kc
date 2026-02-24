import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Building2,
  CarFront,
  CircleCheck,
  FileClock,
  SearchCheck,
  Shield,
  Sparkles,
  Workflow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeroCarousel } from "@/components/marketing/hero-carousel";
import { HeroProofCard } from "@/components/marketing/hero-proof-card";
import { prisma } from "@/lib/prisma";
import { vehicleImageUrl } from "@/lib/vehicle-images";

export const dynamic = "force-dynamic";

const scanBullets = [
  "Eventos con evidencia",
  "Transferencias registradas",
  "Menos riesgo al comprar",
  "Más valor al vender"
];

const pathways = [
  {
    icon: CarFront,
    title: "Particular",
    subtitle: "Tu historial en orden",
    text: "Cargás services, reparaciones y mejoras de forma simple, sin perder contexto.",
    cta: "Entrar como particular",
    href: "/acceso"
  },
  {
    icon: Building2,
    title: "Automotora",
    subtitle: "Operación por vehículo",
    text: "Gestionás stock sin límite y mostrás evidencia real en cada unidad publicada.",
    cta: "Entrar como automotora",
    href: "/acceso"
  },
  {
    icon: SearchCheck,
    title: "Galería",
    subtitle: "Contexto para decidir",
    text: "Explorás fichas con historial, verificación y contacto directo del responsable.",
    cta: "Ver galería",
    href: "/vehiculos"
  }
];

const processCards = [
  {
    icon: FileClock,
    title: "1. Registrás el hecho",
    copy: "Service, inspección, reparación o incidente con fecha y descripción concreta."
  },
  {
    icon: Workflow,
    title: "2. Se guarda la trazabilidad",
    copy: "Origen, verificación y secuencia quedan alineados en una línea de tiempo usable."
  },
  {
    icon: Shield,
    title: "3. Compartís con confianza",
    copy: "Mostrás historial claro para comprar o vender con menos fricción y menos humo."
  }
];

export default async function LandingPage() {
  const featuredRaw = await prisma.vehicle.findMany({
    where: { events: { some: {} } },
    include: {
      events: {
        select: { verificationStatus: true },
        orderBy: { occurredAt: "desc" },
        take: 12
      }
    },
    orderBy: { createdAt: "desc" },
    take: 4
  });

  const featured = await Promise.all(
    featuredRaw.map(async (vehicle) => ({
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate,
      eventsCount: vehicle.events.length,
      verifiedCount: vehicle.events.filter((event) => event.verificationStatus === "VERIFIED").length,
      imageUrl: await vehicleImageUrl({ make: vehicle.make, model: vehicle.model, year: vehicle.year })
    }))
  );

  const lead = featured[0] ?? null;
  const others = featured.slice(1);

  return (
    <div className="space-y-9 pb-12">
      <section className="relative overflow-hidden rounded-[2.2rem] border border-slate-700/70 bg-[linear-gradient(130deg,rgba(8,18,42,0.9),rgba(11,26,58,0.78),rgba(10,16,36,0.9))] p-5 sm:p-7">
        <div className="pointer-events-none absolute -left-24 -top-16 h-96 w-96 rounded-full bg-cyan-400/16 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-20 h-96 w-96 rounded-full bg-blue-500/16 blur-3xl" />

        <div className="relative grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-5 rounded-3xl border border-slate-700/70 bg-slate-950/35 p-5 sm:p-6">
            <span className="glass-chip inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
              <Sparkles className="h-3.5 w-3.5" />
              Infraestructura de confianza vehicular
            </span>

            <h1 className="max-w-xl text-4xl font-black leading-[0.94] tracking-tight sm:text-6xl">
              Historial claro del auto,
              <br />
              <span className="hero-amber">sin verso.</span>
            </h1>

            <p className="max-w-xl text-base font-medium leading-relaxed text-slate-200 sm:text-xl">
              Un registro verificable de servicios, transferencias e incidentes, con evidencia cuando importa.
            </p>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {scanBullets.map((bullet) => (
                <div key={bullet} className="inline-flex items-center gap-2.5 rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-2 text-sm text-slate-200">
                  <CircleCheck className="h-4 w-4 shrink-0 text-cyan-200" />
                  {bullet}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/45 p-3.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <Button asChild size="lg" className="h-11 min-w-[224px] rounded-xl px-6">
                  <Link href="/vehiculos" className="inline-flex items-center gap-2">
                    Buscar un vehículo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="h-11 rounded-xl px-4">
                  <Link href="/acceso" className="inline-flex items-center gap-2">
                    Soy particular
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="h-11 rounded-xl px-4">
                  <Link href="/acceso" className="inline-flex items-center gap-2">
                    Soy automotora
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="mt-3 text-xs font-semibold tracking-[0.09em] text-slate-300 sm:text-sm">
                Registro verificable • Eventos con evidencia • Historial compartible
              </p>
            </div>

            <p className="text-xs text-slate-400">
              No reemplaza una inspección mecánica presencial. Sí te ayuda a separar data real de humo.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-3xl border border-slate-700/80">
              <HeroCarousel className="h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/26 to-transparent" />
            </div>
            <HeroProofCard className="max-w-none" />
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {processCards.map((step) => (
          <Card key={step.title} className="surface-card rounded-2xl p-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-300/10 text-cyan-100">
              <step.icon className="h-5 w-5" />
            </div>
            <h2 className="mt-3 text-xl font-black leading-tight">{step.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{step.copy}</p>
          </Card>
        ))}
      </section>

      <section className="relative overflow-hidden rounded-[2.1rem] border border-slate-700/70 bg-[linear-gradient(145deg,rgba(8,18,42,0.76),rgba(12,24,54,0.7))] p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="glass-chip inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]">
              <BadgeCheck className="h-3.5 w-3.5" />
              Vehículos destacados
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-100 sm:text-4xl">Unidades con historial activo</h2>
          </div>
          <Button asChild variant="outline" size="sm" className="h-10 px-4">
            <Link href="/vehiculos" className="inline-flex items-center gap-2">
              Ver todo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {featured.length === 0 ? (
          <Card className="surface-card mt-5 rounded-2xl p-6">
            <p className="text-sm text-slate-300">Todavía no hay vehículos destacados para mostrar.</p>
          </Card>
        ) : (
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {lead ? (
              <Card className="home-soft-card overflow-hidden rounded-2xl border border-slate-700/70 p-0">
                <div className="relative h-56 w-full sm:h-64">
                  <Image src={lead.imageUrl} alt={`${lead.make} ${lead.model}`} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/84 via-slate-950/20 to-transparent" />
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.13em] text-cyan-200/80">{lead.plate || "Sin matrícula"}</p>
                  <h3 className="mt-1 text-3xl font-black leading-tight text-slate-100">
                    {lead.make} {lead.model}
                  </h3>
                  <p className="text-sm text-slate-300">Año {lead.year}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <div className="home-mini-chip inline-flex items-center rounded-full border border-slate-500/40 bg-slate-950/45 px-2.5 py-1 text-slate-200">
                      <Activity className="mr-1 inline h-3.5 w-3.5 text-cyan-200" />
                      Entradas: <span className="ml-1 font-bold text-white">{lead.eventsCount}</span>
                    </div>
                    <div className="home-mini-chip inline-flex items-center rounded-full border border-slate-500/40 bg-slate-950/45 px-2.5 py-1 text-slate-200">
                      <BadgeCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-300" />
                      Verificados: <span className="ml-1 font-bold text-white">{lead.verifiedCount}</span>
                    </div>
                  </div>
                  <Button asChild size="sm" className="mt-3 w-full sm:w-auto">
                    <Link href={`/publicaciones/${lead.id}`}>Ver publicación</Link>
                  </Button>
                </div>
              </Card>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {others.map((vehicle) => (
                <Card key={vehicle.id} className="home-soft-card overflow-hidden rounded-2xl border border-slate-700/70 p-0">
                  <div className="relative h-40 w-full">
                    <Image src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/12 to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.13em] text-cyan-200/80">{vehicle.plate || "Sin matrícula"}</p>
                    <h3 className="mt-1 text-2xl font-black leading-tight text-slate-100">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-slate-300">Año {vehicle.year}</p>
                    <Button asChild size="sm" className="mt-3 w-full">
                      <Link href={`/publicaciones/${vehicle.id}`}>Ver publicación</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {pathways.map((path) => (
          <Card key={path.title} className="surface-card rounded-3xl p-5">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/35 bg-cyan-300/10 text-cyan-100">
              <path.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/80">{path.title}</p>
            <h3 className="mt-1 text-2xl font-black text-slate-100">{path.subtitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{path.text}</p>
            <Button asChild variant="outline" className="mt-5 w-full">
              <Link href={path.href} className="inline-flex items-center justify-center gap-2">
                {path.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        ))}
      </section>
    </div>
  );
}
