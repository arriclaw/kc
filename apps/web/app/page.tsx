import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Building2,
  CarFront,
  CircleCheck,
  FileCheck2,
  SearchCheck,
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

const heroBullets = [
  "Eventos con evidencia",
  "Transferencias registradas",
  "Menos riesgo al comprar",
  "Más valor al vender"
];

const steps = [
  {
    icon: FileCheck2,
    title: "Cargás eventos reales",
    text: "Service, inspección, reparación o incidente con fecha, detalle y respaldo."
  },
  {
    icon: Workflow,
    title: "Queda trazabilidad",
    text: "Cada movimiento se guarda con origen y estado de verificación."
  },
  {
    icon: SearchCheck,
    title: "Compartís contexto",
    text: "Publicás historial claro para vender o comprar con menos incertidumbre."
  }
];

const entryCards = [
  {
    icon: CarFront,
    title: "Particular",
    subtitle: "Tu auto, tu respaldo",
    text: "Registrás todo lo que le hacés al auto y armás una historia útil en cada venta.",
    href: "/acceso",
    cta: "Entrar como particular"
  },
  {
    icon: Building2,
    title: "Automotora",
    subtitle: "Stock con evidencia",
    text: "Gestionás varias unidades con historial por vehículo y operación comercial ordenada.",
    href: "/acceso",
    cta: "Entrar como automotora"
  }
];

export default async function LandingPage() {
  const featuredVehiclesRaw = await prisma.vehicle.findMany({
    where: {
      events: {
        some: {}
      }
    },
    include: {
      events: {
        select: {
          verificationStatus: true
        },
        orderBy: { occurredAt: "desc" },
        take: 12
      },
      shareLinks: {
        where: { revokedAt: null },
        orderBy: { createdAt: "desc" },
        take: 1
      }
    },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  const featuredVehicles = await Promise.all(
    featuredVehiclesRaw.map(async (vehicle) => ({
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate,
      eventsCount: vehicle.events.length,
      verifiedCount: vehicle.events.filter((event) => event.verificationStatus === "VERIFIED").length,
      publicToken: vehicle.shareLinks[0]?.token || null,
      imageUrl: await vehicleImageUrl({ make: vehicle.make, model: vehicle.model, year: vehicle.year })
    }))
  );

  const lead = featuredVehicles[0] ?? null;
  const side = featuredVehicles.slice(1, 3);
  const rail = featuredVehicles.slice(3, 5);

  return (
    <div className="space-y-8 pb-10">
      <section className="home-surface relative overflow-hidden rounded-[2.4rem] border border-slate-700/70 p-5 sm:p-7">
        <div className="pointer-events-none absolute -left-24 -top-10 h-80 w-80 rounded-full bg-cyan-400/18 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-10 h-96 w-96 rounded-full bg-indigo-500/22 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-5">
            <span className="glass-chip inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
              <Sparkles className="h-3.5 w-3.5" />
              Transparencia vehicular hecha simple
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
              {heroBullets.map((bullet) => (
                <div key={bullet} className="inline-flex items-center gap-2.5 rounded-xl border border-slate-700/70 bg-slate-900/35 px-3 py-2 text-sm text-slate-200">
                  <CircleCheck className="h-4 w-4 shrink-0 text-cyan-200" />
                  {bullet}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/35 p-3.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <Button asChild size="lg" className="h-11 min-w-[220px] rounded-xl px-6">
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

          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-700/80">
              <HeroCarousel className="h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/34 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 z-10">
                <HeroProofCard className="max-w-[25rem]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {steps.map((step) => (
          <Card key={step.title} className="surface-card rounded-2xl p-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-300/10 text-cyan-100">
              <step.icon className="h-5 w-5" />
            </div>
            <h2 className="mt-3 text-xl font-black leading-tight">{step.title}</h2>
            <p className="mt-1.5 text-sm text-slate-300">{step.text}</p>
          </Card>
        ))}
      </section>

      <section className="home-surface relative overflow-hidden rounded-[2.2rem] border border-slate-700/70 p-5 sm:p-6">
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -top-10 h-64 w-64 rounded-full bg-indigo-500/14 blur-3xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="glass-chip inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]">
              <BadgeCheck className="h-3.5 w-3.5" />
              Vehículos destacados
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-100 sm:text-4xl">Mirá unidades con historial activo</h2>
            <p className="mt-1.5 max-w-3xl text-sm text-slate-300 sm:text-base">
              Publicaciones con señales reales de uso, verificación y contacto directo del responsable.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="h-10 px-4">
            <Link href="/vehiculos" className="inline-flex items-center gap-2">
              Ver todas las publicaciones
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {featuredVehicles.length === 0 ? (
          <Card className="surface-card mt-5 rounded-2xl p-6">
            <p className="text-sm text-slate-300">Todavía no hay vehículos destacados para mostrar.</p>
          </Card>
        ) : (
          <div className="mt-5 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
            {lead ? (
              <Card className="home-soft-card group overflow-hidden rounded-3xl border border-slate-700/70 p-0">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={lead.imageUrl}
                    alt={`${lead.make} ${lead.model}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/84 via-slate-950/36 to-transparent" />
                </div>
                <div className="home-feature-hero p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/80">{lead.plate || "Sin matrícula"}</p>
                      <h3 className="mt-1 text-3xl font-black leading-tight text-white sm:text-4xl">
                        {lead.make} {lead.model}
                      </h3>
                      <p className="text-base text-slate-200">Año {lead.year}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="home-feature-chip rounded-xl border border-slate-500/50 bg-slate-950/45 px-3 py-2 text-xs text-slate-200">
                        <Activity className="mr-1.5 inline h-3.5 w-3.5 text-cyan-200" />
                        Entradas: <span className="font-bold text-white">{lead.eventsCount}</span>
                      </div>
                      <div className="home-feature-chip rounded-xl border border-slate-500/50 bg-slate-950/45 px-3 py-2 text-xs text-slate-200">
                        <BadgeCheck className="mr-1.5 inline h-3.5 w-3.5 text-emerald-300" />
                        Verificados: <span className="font-bold text-white">{lead.verifiedCount}</span>
                      </div>
                    </div>
                  </div>
                  <Button asChild size="sm" className="mt-4 min-w-[170px]">
                    <Link href={`/publicaciones/${lead.id}`}>Ver publicación</Link>
                  </Button>
                </div>
              </Card>
            ) : null}

            <div className="grid gap-3">
              {side.map((vehicle) => (
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
                    <Button asChild size="sm" className="mt-3 w-full">
                      <Link href={`/publicaciones/${vehicle.id}`}>Ver publicación</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {rail.length > 0 ? (
          <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
            {rail.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/publicaciones/${vehicle.id}`}
                className="home-soft-card group min-w-[220px] rounded-2xl border border-slate-700/70 p-2.5"
              >
                <div className="relative h-24 w-full overflow-hidden rounded-xl">
                  <Image
                    src={vehicle.imageUrl}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <p className="mt-2 text-sm font-bold text-slate-100">
                  {vehicle.make} {vehicle.model}
                </p>
                <p className="text-xs text-slate-300">{vehicle.year} · {vehicle.plate || "Sin matrícula"}</p>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {entryCards.map((entry) => (
          <Card key={entry.title} className="surface-card rounded-3xl p-5">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/35 bg-cyan-300/10 text-cyan-100">
              <entry.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/80">{entry.title}</p>
            <h3 className="mt-1 text-2xl font-black text-slate-100">{entry.subtitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{entry.text}</p>
            <Button asChild variant="outline" className="mt-5 w-full">
              <Link href={entry.href} className="inline-flex items-center justify-center gap-2">
                {entry.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        ))}

        <Card className="feature-banner rounded-3xl p-5 lg:col-span-1">
          <p className="glass-chip inline-flex text-xs font-bold uppercase tracking-[0.14em]">Galería pública</p>
          <h3 className="mt-3 text-2xl font-black">Explorá con contexto real</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Buscá por matrícula, marca, modelo o año y entrá a fichas con información accionable y contacto directo.
          </p>
          <Button asChild className="mt-5 w-full" size="lg">
            <Link href="/vehiculos" className="inline-flex items-center justify-center gap-2">
              Ver galería
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
