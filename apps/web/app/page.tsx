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

const bullets = [
  "Eventos con evidencia",
  "Transferencias registradas",
  "Menos riesgo al comprar",
  "Más valor al vender"
];

const workflow = [
  {
    icon: FileClock,
    title: "Registrás el evento",
    copy: "Service, inspección, reparación o incidente con fecha y contexto."
  },
  {
    icon: Workflow,
    title: "Queda trazabilidad",
    copy: "Origen y verificación se guardan en cronología clara y consultable."
  },
  {
    icon: Shield,
    title: "Compartís confianza",
    copy: "Mostrás historial útil para comprar o vender con menos incertidumbre."
  }
];

const channels = [
  {
    icon: CarFront,
    title: "Particular",
    subtitle: "Tu auto, tu respaldo",
    text: "Registrás todo lo que le hacés al auto y armás historial útil en cada venta.",
    cta: "Entrar como particular",
    href: "/acceso"
  },
  {
    icon: Building2,
    title: "Automotora",
    subtitle: "Stock con evidencia",
    text: "Gestionás múltiples unidades con trazabilidad por vehículo y operación comercial ordenada.",
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
  const side = featured.slice(1);

  return (
    <div className="space-y-10 pb-12">
      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="relative overflow-hidden rounded-[2.4rem] border border-slate-700/70 bg-[linear-gradient(135deg,rgba(7,16,40,0.96),rgba(8,24,52,0.88),rgba(8,14,34,0.98))] p-6 sm:p-8">
          <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-cyan-400/14 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-blue-500/16 blur-3xl" />

          <div className="relative space-y-6">
            <span className="glass-chip inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
              <Sparkles className="h-3.5 w-3.5" />
              Infraestructura de confianza vehicular
            </span>

            <h1 className="max-w-2xl text-4xl font-black leading-[0.92] tracking-tight sm:text-7xl">
              Historial claro
              <br />
              del auto,
              <br />
              <span className="hero-amber">sin verso.</span>
            </h1>

            <p className="max-w-2xl text-base font-medium leading-relaxed text-slate-200 sm:text-xl">
              Un registro verificable de servicios, transferencias e incidentes, con evidencia cuando importa.
            </p>

            <div className="grid max-w-2xl gap-2.5 sm:grid-cols-2">
              {bullets.map((bullet) => (
                <div key={bullet} className="inline-flex items-center gap-2.5 rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-2 text-sm text-slate-200">
                  <CircleCheck className="h-4 w-4 shrink-0 text-cyan-200" />
                  {bullet}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button asChild size="lg" className="h-11 min-w-[226px] rounded-xl px-6">
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

            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/35 px-4 py-3">
              <p className="text-xs font-semibold tracking-[0.09em] text-slate-300 sm:text-sm">
                Registro verificable • Eventos con evidencia • Historial compartible
              </p>
              <p className="mt-2 text-xs text-slate-400">
                No reemplaza una inspección mecánica presencial. Sí te ayuda a separar data real de humo.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="relative overflow-hidden rounded-[2.4rem] border border-slate-700/80 p-0">
            <HeroCarousel className="h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/24 to-transparent" />
          </Card>
          <HeroProofCard className="max-w-none" />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {workflow.map((step) => (
          <Card key={step.title} className="surface-card rounded-2xl p-5">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-300/10 text-cyan-100">
              <step.icon className="h-5 w-5" />
            </div>
            <h2 className="mt-3 text-xl font-black leading-tight">{step.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{step.copy}</p>
          </Card>
        ))}
      </section>

      <section className="relative overflow-hidden rounded-[2.2rem] border border-slate-700/70 bg-[linear-gradient(145deg,rgba(8,18,42,0.8),rgba(10,24,54,0.72))] p-5 sm:p-6">
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
          <div className="mt-5 grid gap-3 xl:grid-cols-[1.25fr_0.75fr]">
            {lead ? (
              <Card className="home-soft-card overflow-hidden rounded-2xl border border-slate-700/70 p-0">
                <div className="relative h-56 w-full sm:h-72">
                  <Image src={lead.imageUrl} alt={`${lead.make} ${lead.model}`} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/84 via-slate-950/24 to-transparent" />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.13em] text-cyan-200/80">{lead.plate || "Sin matrícula"}</p>
                  <h3 className="mt-1 text-3xl font-black leading-tight text-slate-100 sm:text-4xl">
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
                  <Button asChild size="sm" className="mt-4 w-full sm:w-auto">
                    <Link href={`/publicaciones/${lead.id}`}>Ver publicación</Link>
                  </Button>
                </div>
              </Card>
            ) : null}

            <div className="grid gap-3">
              {side.map((vehicle) => (
                <Card key={vehicle.id} className="home-soft-card overflow-hidden rounded-2xl border border-slate-700/70 p-0">
                  <div className="relative h-36 w-full">
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
        {channels.map((channel) => (
          <Card key={channel.title} className="surface-card rounded-3xl p-5">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/35 bg-cyan-300/10 text-cyan-100">
              <channel.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/80">{channel.title}</p>
            <h3 className="mt-1 text-2xl font-black text-slate-100">{channel.subtitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{channel.text}</p>
            <Button asChild variant="outline" className="mt-5 w-full">
              <Link href={channel.href} className="inline-flex items-center justify-center gap-2">
                {channel.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        ))}
      </section>
    </div>
  );
}
