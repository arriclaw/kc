import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, Car, CircleCheck, Gauge, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgePills } from "@/components/vehicle/badge-pills";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/acceso");

  const vehicles = await prisma.vehicle.findMany({
    where: {
      ownerships: {
        some: { userId: session.user.id, ownershipStatus: "CURRENT" }
      }
    },
    include: {
      badges: true,
      events: { orderBy: { occurredAt: "desc" }, take: 5 }
    },
    orderBy: { createdAt: "desc" }
  });

  const totalEvents = vehicles.reduce((acc, vehicle) => acc + vehicle.events.length, 0);
  const verifiedEvents = vehicles.reduce(
    (acc, vehicle) => acc + vehicle.events.filter((event) => event.verificationStatus === "VERIFIED").length,
    0
  );
  const trustCoverage = totalEvents === 0 ? 0 : Math.round((verifiedEvents / totalEvents) * 100);
  const isDealer = session.user.role === "DEALER" || session.user.role === "ADMIN";

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Vehículos activos</p>
          <p className="mt-2 text-4xl font-black text-white">{vehicles.length}</p>
        </Card>
        <Card className="glass-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Eventos recientes</p>
          <p className="mt-2 text-4xl font-black text-white">{totalEvents}</p>
        </Card>
        <Card className="glass-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Cobertura verificada</p>
          <p className="mt-2 text-4xl font-black text-white">{trustCoverage}%</p>
        </Card>
      </section>

      <Card className="glass-panel rounded-[2rem] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="glass-chip inline-flex text-xs font-semibold uppercase tracking-[0.14em]">Panel operativo</p>
            <h1 className="mt-3 text-3xl font-black text-white">Panel principal de tu operación</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Cargá eventos críticos y publicá links trazables para acelerar confianza en compra/venta.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/vehiculos/nuevo">Nuevo vehículo</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/particular">Modo particular</Link>
            </Button>
            {isDealer ? (
              <Button asChild variant="outline">
                <Link href="/dealer">Modo automotora</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="glass-panel rounded-3xl p-5">
          <h2 className="text-lg font-bold text-white">Checklist de arranque</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <p className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/35 px-3 py-2">
              <Car className="h-4 w-4 text-cyan-200" />
              1. Registrá tu primer vehículo.
            </p>
            <p className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/35 px-3 py-2">
              <Gauge className="h-4 w-4 text-cyan-200" />
              2. Cargá service u odómetro para iniciar trazabilidad.
            </p>
            <p className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/35 px-3 py-2">
              <ShieldCheck className="h-4 w-4 text-cyan-200" />
              3. Compartí link público cuando tengas historial sólido.
            </p>
          </div>
        </Card>

        <Card className="glass-panel rounded-3xl p-5">
          <h2 className="text-lg font-bold text-white">{isDealer ? "Flujo Automotora" : "Flujo Particular"}</h2>
          <p className="mt-2 text-sm text-slate-300">
            {isDealer
              ? "Alta de unidades, carga de historial por auto y publicación para acelerar cierre comercial."
              : "Historial de tu auto al día para sostener valor de reventa y evitar discusiones sin evidencia."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {isDealer ? (
              <Button asChild variant="outline">
                <Link href="/dealer">
                  <Building2 className="mr-2 h-4 w-4" />
                  Ir al portal automotora
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href="/particular">
                  <CircleCheck className="mr-2 h-4 w-4" />
                  Ir a mi garage
                </Link>
              </Button>
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {vehicles.map((vehicle) => {
          const latest = vehicle.events[0];
          return (
            <Card key={vehicle.id} className="glass-panel rounded-3xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </h2>
                  <p className="text-sm text-slate-400">Matrícula: {vehicle.plate || "Sin dato"}</p>
                </div>
                <Button asChild size="sm">
                  <Link href={`/vehiculos/${vehicle.id}`}>Abrir historial</Link>
                </Button>
              </div>

              <div className="mt-3">
                <BadgePills badges={vehicle.badges} />
              </div>

              <div className="mt-3 rounded-xl border border-slate-700/70 bg-slate-900/45 p-3 text-sm">
                {latest ? (
                  <>
                    <p className="font-medium text-slate-100">Último evento: {latest.title}</p>
                    <p className="text-slate-400">{new Date(latest.occurredAt).toLocaleDateString("es-UY")}</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-slate-100">Todavía no tiene eventos</p>
                    <p className="text-slate-400">Cargar primer service mejora valor de reventa.</p>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
