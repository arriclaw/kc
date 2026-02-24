import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Building2,
  CarFront,
  CircleCheck,
  SearchCheck,
  ShieldCheck,
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

const rutas = [
  {
    icon: CarFront,
    title: "Particular",
    subtitle: "Tu auto, tu respaldo",
    copy: "Registrás services, reparaciones y mejoras para construir historial útil en la vida real.",
    points: ["Alta rápida del vehículo", "Transferencia entre usuarios reales"],
    cta: "Ingresar como particular",
    href: "/acceso"
  },
  {
    icon: Building2,
    title: "Automotora",
    subtitle: "Stock con evidencia",
    copy: "Gestionás múltiples unidades con trazabilidad por vehículo y operación comercial más prolija.",
    points: ["Sin límite de unidades", "Más confianza en cada publicación"],
    cta: "Ingresar como automotora",
    href: "/acceso"
  },
  {
    icon: SearchCheck,
    title: "Galería pública",
    subtitle: "Contexto para decidir",
    copy: "Explorás publicaciones con historial, titularidad y canales de contacto directo.",
    points: ["Filtro por matrícula, marca, modelo o año", "Ficha pública con historial"],
    cta: "Ver galería",
    href: "/vehiculos"
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
    take: 7
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

  const heroFeatured = featuredVehicles[0] ?? null;
  const sideFeatured = featuredVehicles.slice(1, 5);
  const railFeatured = featuredVehicles.slice(5, 7);

  return (
    <div className="space-y-8 pb-10">
      <section className="home-surface relative overflow-hidden rounded-[2.6rem] border border-slate-700/70 p-5 sm:p-7">
        <div className="pointer-events-none absolute -left-20 -top-12 h-80 w-80 rounded-full bg-cyan-400/18 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 top-12 h-96 w-96 rounded-full bg-indigo-500/22 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
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
                  <Link href="/vehiculos" className="inline-flex items-center gap-2.5 font-semibold">
                    Buscar un vehículo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="h-10 rounded-xl px-4">
                  <Link href="/acceso" className="inline-flex items-center gap-2">
                    Soy particular
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="h-10 rounded-xl px-4">
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

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="relative min-h-[330px] overflow-hidden rounded-[2rem] border border-slate-700/80">
              <HeroCarousel className="h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/28 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 z-10">
                <HeroProofCard className="max-w-[26rem]" />
              </div>
            </div>

            {heroFeatured ? (
              <Card className="home-soft-card overflow-hidden rounded-2xl border border-slate-700/70 p-0 xl:hidden">
                <div className="relative h-36 w-full">
                  <Image src={heroFeatured.imageUrl} alt={`${heroFeatured.make} ${heroFeatured.model}`} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/14 to-transparent" />
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/80">{heroFeatured.plate || "Sin matrícula"}</p>
                  <h3 className="mt-1 text-xl font-black leading-tight text-slate-100">
                    {heroFeatured.make} {heroFeatured.model}
                  </h3>
                  <p className="text-sm text-slate-300">Año {heroFeatured.year}</p>
                  <Button asChild size="sm" className="mt-3 w-full">
                    <Link href={`/publicaciones/${heroFeatured.id}`}>Ver publicación destacada</Link>
                  </Button>
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </section>

      <section className="home-surface relative overflow-hidden rounded-[2.2rem] border border-slate-700/70 p-5 sm:p-6">
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -top-12 h-64 w-64 rounded-full bg-indigo-500/14 blur-3xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="glass-chip inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]">
              <ShieldCheck className="h-3.5 w-3.5" />
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
          <div className="mt-5 grid gap-3 xl:grid-cols-[1.35fr_1fr_0.74fr]">
            {heroFeatured ? (
              <Card className="home-soft-card group overflow-hidden rounded-3xl border border-slate-700/70 p-0 xl:col-span-2">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={heroFeatured.imageUrl}
                    alt={`${heroFeatured.make} ${heroFeatured.model}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/36 to-transparent" />
                </div>
                <div className="home-feature-hero p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/80">{heroFeatured.plate || "Sin matrícula"}</p>
                      <h3 className="mt-1 text-4xl font-black leading-tight text-white">
                        {heroFeatured.make} {heroFeatured.model}
                      </h3>
                      <p className="text-base text-slate-200">Año {heroFeatured.year}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="home-feature-chip rounded-xl border border-slate-500/50 bg-slate-950/45 px-3 py-2 text-xs text-slate-200">
                        <Activity className="mr-1.5 inline h-3.5 w-3.5 text-cyan-200" />
                        Entradas: <span className="font-bold text-white">{heroFeatured.eventsCount}</span>
                      </div>
                      <div className="home-feature-chip rounded-xl border border-slate-500/50 bg-slate-950/45 px-3 py-2 text-xs text-slate-200">
                        <BadgeCheck className="mr-1.5 inline h-3.5 w-3.5 text-emerald-300" />
                        Verificados: <span className="font-bold text-white">{heroFeatured.verifiedCount}</span>
                      </div>
                    </div>
                  </div>
                  <Button asChild size="sm" className="mt-4 min-w-[170px]">
                    <Link href={`/publicaciones/${heroFeatured.id}`}>Ver publicación</Link>
                  </Button>
                </div>
              </Card>
            ) : null}

            <div className="grid gap-3">
              {sideFeatured.map((vehicle) => (
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

            <div className="grid gap-3">
              {railFeatured.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/publicaciones/${vehicle.id}`}
                  className="home-soft-card group overflow-hidden rounded-2xl border border-slate-700/70 p-2.5"
                >
                  <div className="relative h-28 w-full overflow-hidden rounded-xl">
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
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-12">
        <Card className="home-surface relative overflow-hidden rounded-3xl border border-slate-700/70 p-6 lg:col-span-8">
          <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-cyan-300/12 blur-3xl" />
          <div className="relative flex items-center gap-2">
            <p className="glass-chip inline-flex text-[11px] font-bold uppercase tracking-[0.14em]">Elegí tu camino</p>
            <p className="rounded-full border border-slate-600/70 bg-slate-900/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
              Particular + Automotora
            </p>
          </div>
          <h2 className="mt-4 text-3xl font-black text-slate-100 sm:text-4xl">Cada perfil con su operación correcta</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Mismo lenguaje de confianza para todos: carga rápida, evidencia trazable y publicación con contexto real.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {rutas.slice(0, 2).map((ruta) => (
              <article key={ruta.title} className="home-soft-card rounded-2xl border border-slate-700/70 p-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-300/10 text-cyan-100">
                  <ruta.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/80">{ruta.title}</p>
                <h3 className="mt-1 text-3xl font-black leading-tight text-slate-100">{ruta.subtitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{ruta.copy}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-200">
                  {ruta.points.map((point) => (
                    <p key={point} className="inline-flex items-center gap-2">
                      <CircleCheck className="h-4 w-4 text-cyan-200" />
                      {point}
                    </p>
                  ))}
                </div>
                <Button asChild className="mt-5 w-full" variant="outline">
                  <Link href={ruta.href} className="inline-flex items-center justify-center gap-2">
                    {ruta.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </Card>

        <Card className="home-surface relative overflow-hidden rounded-3xl border border-slate-700/70 p-6 lg:col-span-4">
          <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/35 bg-cyan-300/10 text-cyan-100">
              <Workflow className="h-5 w-5" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/80">Galería pública</p>
            <h3 className="mt-1 text-3xl font-black text-slate-100">Explorá con contexto real</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{rutas[2]?.copy}</p>

            <div className="mt-4 space-y-2">
              {rutas[2]?.points.map((point) => (
                <div key={point} className="rounded-xl border border-slate-700/70 bg-slate-900/35 px-3 py-2 text-sm text-slate-200">
                  {point}
                </div>
              ))}
            </div>

            <Button asChild className="mt-5 w-full" size="lg">
              <Link href={rutas[2]!.href} className="inline-flex items-center justify-center gap-2">
                {rutas[2]!.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
