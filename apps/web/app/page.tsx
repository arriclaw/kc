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
  Shield,
  Sparkles,
  WalletCards
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeroCarousel } from "@/components/marketing/hero-carousel";
import { HeroProofCard } from "@/components/marketing/hero-proof-card";
import { prisma } from "@/lib/prisma";
import { vehicleImageUrl } from "@/lib/vehicle-images";

export const dynamic = "force-dynamic";

const segmentos = [
  {
    icon: CarFront,
    eyebrow: "Particular",
    title: "Tu auto, tu respaldo",
    description: "Registrás services, reparaciones y mejoras en minutos para mantener una historia ordenada y vendible.",
    points: ["Carga guiada por evento", "Transferencia entre usuarios reales"],
    href: "/acceso",
    cta: "Ingresar como particular"
  },
  {
    icon: Building2,
    eyebrow: "Automotora",
    title: "Stock con evidencia",
    description: "Gestionás múltiples unidades con historial por vehículo y contacto directo para acelerar el cierre.",
    points: ["Sin límite de unidades", "Operación por auto en Mi Garage"],
    href: "/acceso",
    cta: "Ingresar como automotora"
  },
  {
    icon: SearchCheck,
    eyebrow: "Galería pública",
    title: "Contexto para decidir",
    description: "Comparás publicaciones con señales concretas: eventos, verificación, titularidad y canales de contacto.",
    points: ["Filtro por matrícula, marca, modelo o año", "Ficha pública con historial"],
    href: "/vehiculos",
    cta: "Ver galería"
  }
];

const heroBullets = [
  "Eventos con evidencia",
  "Transferencias registradas",
  "Menos riesgo al comprar",
  "Más valor al vender"
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
    take: 6
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

  const mainFeatured = featuredVehicles[0] ?? null;
  const sideFeatured = featuredVehicles.slice(1, 3);

  return (
    <div className="space-y-8 pb-10">
      <section className="home-surface relative overflow-hidden rounded-[2.5rem] border border-slate-700/65 p-5 sm:p-7">
        <div className="pointer-events-none absolute -left-24 -top-14 h-80 w-80 rounded-full bg-cyan-400/16 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -top-16 h-96 w-96 rounded-full bg-indigo-500/18 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="space-y-5 lg:pr-4">
            <span className="glass-chip inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
              <Sparkles className="h-3.5 w-3.5" />
              Transparencia vehicular hecha simple
            </span>

            <h1 className="max-w-xl text-4xl font-black leading-[0.96] tracking-tight sm:text-6xl">
              Historial claro del auto,
              <br />
              <span className="hero-amber">sin verso.</span>
            </h1>

            <p className="max-w-xl text-base font-medium leading-relaxed text-slate-200 sm:text-xl">
              Un registro verificable de servicios, transferencias e incidentes, con evidencia cuando importa.
            </p>

            <ul className="grid max-w-xl gap-x-6 gap-y-2.5 text-sm text-slate-200 sm:grid-cols-2 sm:text-base">
              {heroBullets.map((bullet) => (
                <li key={bullet} className="inline-flex items-center gap-2.5 leading-none">
                  <CircleCheck className="h-4 w-4 shrink-0 text-cyan-200" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2.5">
              <Button asChild size="lg" className="h-12 min-w-[230px] rounded-xl px-7">
                <Link href="/vehiculos" className="inline-flex items-center gap-2.5 font-semibold">
                  Buscar un vehículo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex flex-wrap items-center gap-2.5">
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
            </div>

            <p className="text-xs font-semibold tracking-[0.09em] text-slate-300 sm:text-sm">
              Registro verificable • Eventos con evidencia • Historial compartible
            </p>
            <p className="text-xs text-slate-400">
              No reemplaza una inspección mecánica presencial. Sí te ayuda a separar data real de humo.
            </p>
          </div>

          <div className="relative">
            <HeroCarousel className="h-full" />
            <div className="hero-proof-slot pointer-events-none absolute inset-x-4 bottom-4 z-10 hidden lg:block">
              <HeroProofCard className="pointer-events-auto" />
            </div>
          </div>

          <div className="lg:hidden">
            <HeroProofCard className="max-w-none" />
          </div>
        </div>
      </section>

      <section className="home-surface relative overflow-hidden rounded-[2.1rem] border border-slate-700/65 p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-12 top-0 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-10 h-56 w-56 rounded-full bg-indigo-500/12 blur-3xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="glass-chip inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]">
              <Shield className="h-3.5 w-3.5" />
              Vehículos destacados
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-100 sm:text-4xl">Mirá unidades con historial activo</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
              Publicaciones con señales reales de uso, verificaciones y contexto para decidir más rápido.
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
          <Card className="glass-panel mt-5 rounded-2xl p-6">
            <p className="text-sm text-slate-300">Todavía no hay vehículos destacados para mostrar.</p>
          </Card>
        ) : (
          <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1.32fr)_minmax(340px,0.68fr)]">
            {mainFeatured ? (
              <Card className="home-soft-card group relative overflow-hidden rounded-3xl border border-slate-700/70 p-0">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={mainFeatured.imageUrl}
                    alt={`${mainFeatured.make} ${mainFeatured.model}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/40 to-transparent" />
                </div>
                <div className="home-feature-hero p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">{mainFeatured.plate || "Sin matrícula"}</p>
                      <h3 className="mt-1 text-4xl font-black leading-tight text-white">
                        {mainFeatured.make} {mainFeatured.model}
                      </h3>
                      <p className="text-base text-slate-200">Año {mainFeatured.year}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="home-feature-chip rounded-xl border border-slate-500/50 bg-slate-950/45 px-3 py-2 text-xs">
                        <Activity className="mr-1.5 inline h-3.5 w-3.5 text-cyan-200" />
                        Entradas: <span className="font-bold text-white">{mainFeatured.eventsCount}</span>
                      </div>
                      <div className="home-feature-chip rounded-xl border border-slate-500/50 bg-slate-950/45 px-3 py-2 text-xs">
                        <BadgeCheck className="mr-1.5 inline h-3.5 w-3.5 text-emerald-300" />
                        Verificados: <span className="font-bold text-white">{mainFeatured.verifiedCount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button asChild size="sm" className="min-w-[170px]">
                      <Link href={`/publicaciones/${mainFeatured.id}`}>Ver publicación</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ) : null}

            <div className="grid gap-3 lg:grid-rows-2">
              {sideFeatured.map((vehicle) => (
                <Card key={vehicle.id} className="home-soft-card overflow-hidden rounded-2xl border border-slate-700/70 p-0">
                  <div className="relative h-40 w-full">
                    <Image src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/16 to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">{vehicle.plate || "Sin matrícula"}</p>
                    <h3 className="mt-1 text-2xl font-black leading-tight text-slate-100 sm:text-[2rem]">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-slate-300">Año {vehicle.year}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <div className="home-mini-chip inline-flex items-center rounded-full border border-slate-500/40 bg-slate-950/45 px-2.5 py-1 text-xs text-slate-200">
                        <Activity className="mr-1 inline h-3.5 w-3.5 text-cyan-200" />
                        Entradas: <span className="ml-1 font-bold text-white">{vehicle.eventsCount}</span>
                      </div>
                      <div className="home-mini-chip inline-flex items-center rounded-full border border-slate-500/40 bg-slate-950/45 px-2.5 py-1 text-xs text-slate-200">
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
      </section>

      <section className="grid gap-4 lg:grid-cols-12">
        <Card className="home-surface relative overflow-hidden rounded-3xl border border-slate-700/65 p-6 lg:col-span-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-300/12 blur-3xl" />
          <div className="relative">
            <p className="glass-chip inline-flex text-[11px] font-bold uppercase tracking-[0.14em]">Elegí tu camino</p>
            <h2 className="mt-4 text-3xl font-black text-slate-100 sm:text-4xl">Activá tu perfil y empezá hoy</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Cargá evidencia real sin fricción, mantené una cronología limpia y compartí lo importante cuando toque vender o comprar.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {segmentos.slice(0, 2).map((item) => (
              <article
                key={item.title}
                className="home-soft-card group relative overflow-hidden rounded-2xl border border-slate-700/70 p-4"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-300/10 blur-2xl transition group-hover:scale-125" />
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-300/10 text-cyan-100">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/80">{item.eyebrow}</p>
                <h3 className="mt-1 text-[1.9rem] font-black leading-tight text-slate-100">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-200">
                  {item.points.map((point) => (
                    <p key={point} className="inline-flex items-center gap-2">
                      <CircleCheck className="h-4 w-4 text-cyan-200" />
                      {point}
                    </p>
                  ))}
                </div>
                <Button asChild className="mt-5 w-full" variant="outline">
                  <Link href={item.href} className="inline-flex items-center justify-center gap-2">
                    {item.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </Card>

        <Card className="home-surface relative overflow-hidden rounded-3xl border border-slate-700/65 p-6 lg:col-span-4">
          <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/35 bg-cyan-300/10 text-cyan-100">
              <WalletCards className="h-5 w-5" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/80">Galería pública</p>
            <h3 className="mt-1 text-2xl font-black leading-tight text-slate-100 sm:text-[2rem]">Explorá con contexto real</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{segmentos[2]?.description}</p>

            <div className="mt-4 space-y-2">
              {segmentos[2]?.points.map((point) => (
                <div key={point} className="rounded-xl border border-slate-700/70 bg-slate-900/35 px-3 py-2 text-sm text-slate-200">
                  {point}
                </div>
              ))}
            </div>

            <Button asChild className="mt-5 w-full" size="lg">
              <Link href={segmentos[2]!.href} className="inline-flex items-center justify-center gap-2">
                {segmentos[2]!.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
