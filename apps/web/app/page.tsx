import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeroCarousel } from "@/components/marketing/hero-carousel";

const pilares = [
  {
    titulo: "Para vos, siempre",
    texto: "Cargás lo que le hacés al auto durante años y armás un historial que te acompaña en cada venta.",
    cta: "/acceso"
  },
  {
    titulo: "Para automotoras",
    texto: "Gestionás varios autos, registrás historial por unidad y mostrás transparencia que acelera decisiones.",
    cta: "/acceso"
  },
  {
    titulo: "Galería pública",
    texto: "Buscá por marca, modelo o matrícula y entrá al detalle de cada publicación con contexto real.",
    cta: "/vehiculos"
  }
];

export default function LandingPage() {
  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-slate-700/70 p-6 sm:p-8">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 top-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_1fr]">
          <div className="space-y-6">
            <span className="glass-chip inline-flex text-xs font-semibold uppercase tracking-[0.18em]">
              Transparencia vehicular hecha simple
            </span>
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-6xl">
              Historial claro del auto, <span className="hero-amber">sin verso.</span>
            </h1>
            <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
              Kilómetro Claro une particulares, automotoras y compradores en una sola verdad: eventos trazables,
              origen explícito y límites bien contados.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/acceso">Soy particular</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/acceso">Soy automotora</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="glass-panel absolute -left-5 top-8 z-20 rounded-2xl p-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
              Registro inmutable verificable
            </div>
            <HeroCarousel />
            <div className="warning-card absolute -bottom-5 right-3 z-20 max-w-[18rem] rounded-2xl border p-4 text-sm shadow-[0_14px_34px_rgba(251,191,36,0.18)] backdrop-blur-xl">
              <p className="warning-title inline-flex items-center gap-2 font-extrabold uppercase tracking-[0.14em]">
                <AlertTriangle className="h-4 w-4" />
                Ojo importante
              </p>
              <p className="warning-body mt-1.5 max-w-[16rem] leading-snug">
                No reemplaza una inspección mecánica presencial. Sí te ayuda a separar data real de humo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {pilares.map((item) => (
          <Card key={item.titulo} className="glass-panel rounded-3xl p-6">
            <h2 className="text-xl font-bold text-slate-100">{item.titulo}</h2>
            <p className="mt-2 text-sm text-slate-300">{item.texto}</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href={item.cta}>Entrar</Link>
            </Button>
          </Card>
        ))}
      </section>
    </div>
  );
}
