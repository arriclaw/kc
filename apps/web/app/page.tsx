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
  Star,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeroCarousel } from "@/components/marketing/hero-carousel";
import { HeroProofCard } from "@/components/marketing/hero-proof-card";
import { prisma } from "@/lib/prisma";
import { vehicleImageUrl } from "@/lib/vehicle-images";

export const dynamic = "force-dynamic";

const pilares = [
  {
    icon: CarFront,
    eyebrow: "Particular",
    titulo: "Tu auto, tu respaldo",
    texto: "Registrá services, reparaciones y mejoras para construir historial útil en la vida real.",
    beneficios: ["Alta rápida del vehículo", "Cronología clara para vender mejor"],
    cta: "/acceso",
    ctaLabel: "Quiero empezar"
  },
  {
    icon: Building2,
    eyebrow: "Automotora",
    titulo: "Stock con evidencia",
    texto: "Gestioná múltiples unidades con trazabilidad por vehículo y operación comercial más prolija.",
    beneficios: ["Sin límite de unidades", "Más confianza en cada publicación"],
    cta: "/acceso",
    ctaLabel: "Ingresar como automotora"
  },
  {
    icon: SearchCheck,
    eyebrow: "Compradores",
    titulo: "Galería con contexto",
    texto: "Explorá publicaciones con datos accionables, titularidad y contacto directo del responsable.",
    beneficios: ["Buscador por matrícula, marca, modelo o año", "Ficha pública con historial y contacto"],
    cta: "/vehiculos",
    ctaLabel: "Ver galería"
  }
];

const heroScanBullets = [
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

  return (
    <div className="space-y-8 pb-10">
      <section className="home-surface relative overflow-hidden rounded-[2.5rem] border border-slate-700/70 p-5 sm:p-7">
        <div className="pointer-events-none absolute -left-20 top-2 h-72 w-72 rounded-full bg-cyan-400/18 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-indigo-500/24 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-stretch">
          <div className="space-y-5">
            <span className="glass-chip inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
              <Sparkles className="h-3.5 w-3.5" />
              Transparencia vehicular hecha simple
            </span>

            <h1 className="max-w-2xl text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl">
              Historial claro del auto,
              <br />
              <span className="hero-amber">sin verso.</span>
            </h1>

            <p className="max-w-2xl text-base font-medium leading-relaxed text-slate-200 sm:text-lg">
              Un registro verificable de servicios, transferencias e incidentes, con evidencia cuando importa.
            </p>

            <ul className="grid max-w-2xl gap-x-5 gap-y-2 text-sm text-slate-200 sm:grid-cols-2">
              {heroScanBullets.map((bullet) => (
                <li key={bullet} className="inline-flex items-center gap-2 leading-none">
                  <CircleCheck className="h-4 w-4 shrink-0 text-cyan-200" />
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-start gap-2.5">
              <Button asChild size="lg" className="h-11 min-w-[214px] rounded-xl px-6">
                <Link href="/vehiculos" className="inline-flex items-center gap-2 font-semibold">
                  Buscar un vehículo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center gap-2.5">
                <Button asChild size="sm" variant="outline" className="h-10 rounded-xl px-4">
                  <Link href="/acceso" className="inline-flex items-center gap-2 font-medium">
                    Soy particular
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="h-10 rounded-xl px-4">
                  <Link href="/acceso" className="inline-flex items-center gap-2 font-medium">
                    Soy automotora
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <p className="text-xs font-semibold tracking-[0.06em] text-slate-300 sm:text-sm">
              Registro verificable • Eventos con evidencia • Historial compartible
            </p>

            <p className="text-xs text-slate-400">
              No reemplaza una inspección mecánica presencial. Sí te ayuda a separar data real de humo.
            </p>

            <div className="lg:hidden">
              <HeroProofCard className="max-w-none" />
            </div>
          </div>

          <div className="relative flex h-full flex-col">
            <HeroCarousel className="flex-1" />
            <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 hidden justify-start px-4 lg:flex">
              <HeroProofCard />
            </div>
          </div>
        </div>
      </section>

      <section className="home-surface relative overflow-hidden rounded-[2.1rem] border border-slate-700/70 bg-slate-900/25 p-4 sm:p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-indigo-400/14 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="glass-chip inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]">
              <Star className="h-3.5 w-3.5" />
              Vehículos destacados
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-100 sm:text-3xl">Mirá unidades con historial activo</h2>
            <p className="mt-1.5 max-w-3xl text-sm text-slate-300">
              Publicaciones con señales reales de uso, verificaciones y contexto para decidir rápido.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
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
          <>
            <div className="mt-4 grid gap-3 lg:h-[660px] lg:grid-cols-[minmax(0,1.3fr)_minmax(340px,1fr)] lg:items-stretch xl:h-[700px]">
              {featuredVehicles[0] ? (
                <Card className="glass-panel group relative overflow-hidden rounded-3xl p-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
                  <div className="relative aspect-[16/10] w-full lg:h-full lg:flex-1 lg:aspect-auto">
                    <Image
                      src={featuredVehicles[0].imageUrl}
                      alt={`${featuredVehicles[0].make} ${featuredVehicles[0].model}`}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/66 via-slate-950/12 to-transparent" />
                  </div>
                  <div className="home-feature-hero p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/80">{featuredVehicles[0].plate || "Sin matrícula"}</p>
                        <h3 className="mt-1 text-[1.85rem] font-black leading-tight text-white">
                          {featuredVehicles[0].make} {featuredVehicles[0].model}
                        </h3>
                        <p className="text-sm text-slate-200">Año {featuredVehicles[0].year}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div className="home-feature-chip rounded-xl border border-slate-500/50 bg-slate-950/45 px-3 py-2 text-xs text-slate-200">
                          <Activity className="mr-1 inline h-3.5 w-3.5 text-cyan-200" />
                          Entradas: <span className="font-bold text-white">{featuredVehicles[0].eventsCount}</span>
                        </div>
                        <div className="home-feature-chip rounded-xl border border-slate-500/50 bg-slate-950/45 px-3 py-2 text-xs text-slate-200">
                          <BadgeCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-300" />
                          Verificados: <span className="font-bold text-white">{featuredVehicles[0].verifiedCount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Button asChild size="sm" className="min-w-[150px]">
                        <Link href={`/publicaciones/${featuredVehicles[0].id}`}>Ver publicación</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : null}

              <div className="grid h-full gap-3 lg:grid-rows-2">
                {featuredVehicles.slice(1, 3).map((vehicle) => (
                  <Card key={vehicle.id} className="glass-panel home-soft-card overflow-hidden rounded-2xl p-0 lg:h-full">
                    <div className="relative h-32 w-full">
                      <Image src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} fill className="object-cover" unoptimized />
                    </div>
                    <div className="p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/80">{vehicle.plate || "Sin matrícula"}</p>
                      <h3 className="mt-1 text-lg font-black text-slate-100">
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

            {featuredVehicles.length > 3 ? (
              <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
                {featuredVehicles.slice(3).map((vehicle) => (
                  <Link
                    key={vehicle.id}
                    href={`/publicaciones/${vehicle.id}`}
                    className="home-soft-card group min-w-[220px] rounded-2xl border border-slate-700/70 bg-slate-900/35 p-2.5 transition hover:border-cyan-300/40 hover:bg-slate-900/55"
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
                    <p className="text-xs text-slate-300">{vehicle.year}</p>
                  </Link>
                ))}
              </div>
            ) : null}
          </>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-12">
        <Card className="glass-panel home-surface relative overflow-hidden rounded-3xl p-6 lg:col-span-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-300/12 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <p className="glass-chip inline-flex text-[11px] font-bold uppercase tracking-[0.14em]">Elegí tu camino</p>
              <p className="rounded-full border border-slate-600/70 bg-slate-900/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                Particulares + Automotoras
              </p>
            </div>
            <h2 className="mt-4 text-3xl font-black text-slate-100 sm:text-4xl">Entrá por tu perfil y empezá hoy</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
              La experiencia está pensada para que cargues evidencia real sin fricción: flujo claro, contexto útil y confianza
              comercial desde el día uno.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {pilares.slice(0, 2).map((item) => (
              <article
                key={item.titulo}
                className="home-soft-card group relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/35 p-4"
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-cyan-300/10 blur-2xl transition group-hover:scale-125" />
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-300/10 text-cyan-100">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/80">{item.eyebrow}</p>
                <h3 className="mt-1 text-2xl font-black text-slate-100">{item.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.texto}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-200">
                  {item.beneficios.map((beneficio) => (
                    <p key={beneficio} className="inline-flex items-center gap-2">
                      <CircleCheck className="h-4 w-4 text-cyan-200" />
                      {beneficio}
                    </p>
                  ))}
                </div>
                <Button asChild className="mt-5 w-full" variant="outline">
                  <Link href={item.cta} className="inline-flex items-center justify-center gap-2">
                    {item.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </Card>

        <Card className="glass-panel home-surface relative overflow-hidden rounded-3xl p-6 lg:col-span-4">
          <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-indigo-300/18 blur-3xl" />
          <div className="relative">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/35 bg-cyan-300/10 text-cyan-100">
              <SearchCheck className="h-5 w-5" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/80">Galería pública</p>
            <h3 className="mt-1 text-3xl font-black text-slate-100">Explorá con contexto real</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{pilares[2]?.texto}</p>

            <div className="mt-4 grid gap-2">
              {pilares[2]?.beneficios.map((beneficio) => (
                <div key={beneficio} className="rounded-xl border border-slate-700/70 bg-slate-900/35 px-3 py-2 text-sm text-slate-200">
                  {beneficio}
                </div>
              ))}
            </div>

            <div className="home-soft-card mt-4 rounded-2xl border border-slate-700/70 bg-slate-900/35 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-cyan-200/80">Tip rápido</p>
              <p className="mt-1.5 text-sm text-slate-300">Usá el buscador para filtrar por matrícula, marca, modelo o año.</p>
            </div>

            <Button asChild className="mt-5 w-full" size="lg">
              <Link href={pilares[2]!.cta} className="inline-flex items-center justify-center gap-2">
                {pilares[2]!.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
