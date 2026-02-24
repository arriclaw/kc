import Link from "next/link";
import { CarFront, CircleCheckBig, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GarageVehicleCard } from "@/components/vehicle/garage-vehicle-card";
import { GarageAddVehicleInline } from "@/components/vehicle/garage-add-vehicle-inline";
import { vehicleImageUrl } from "@/lib/vehicle-images";

export default async function ParticularPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/acceso");

  const vehicles = await prisma.vehicle.findMany({
    where: {
      ownerships: {
        some: {
          userId: session.user.id,
          ownershipStatus: "CURRENT"
        }
      }
    },
    include: {
      events: { orderBy: { occurredAt: "desc" }, take: 5 },
      badges: true
    },
    orderBy: { createdAt: "desc" }
  });

  const totalEvents = vehicles.reduce((acc, vehicle) => acc + vehicle.events.length, 0);
  const verifiedEvents = vehicles.reduce(
    (acc, vehicle) => acc + vehicle.events.filter((event) => event.verificationStatus === "VERIFIED").length,
    0
  );
  const trustCoverage = totalEvents === 0 ? 0 : Math.round((verifiedEvents / totalEvents) * 100);

  const vehiclesWithImage = await Promise.all(
    vehicles.map(async (vehicle) => ({
      vehicle,
      imageUrl: await vehicleImageUrl({ make: vehicle.make, model: vehicle.model, year: vehicle.year })
    }))
  );
  const canAddVehicle = vehicles.length < 1;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="metric-card rounded-3xl p-5">
          <p className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-slate-400">
            <CarFront className="h-3.5 w-3.5" />
            Vehículos activos
          </p>
          <p className="mt-2 text-4xl font-black">{vehicles.length}</p>
        </Card>
        <Card className="metric-card rounded-3xl p-5">
          <p className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-slate-400">
            <CircleCheckBig className="h-3.5 w-3.5" />
            Entradas registradas
          </p>
          <p className="mt-2 text-4xl font-black">{totalEvents}</p>
        </Card>
        <Card className="metric-card rounded-3xl p-5">
          <p className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Cobertura verificada
          </p>
          <p className="mt-2 text-4xl font-black">{trustCoverage}%</p>
        </Card>
      </section>

      <Card className="feature-banner rounded-[2rem] p-6">
        <p className="glass-chip inline-flex text-xs font-semibold uppercase tracking-wide">Mi Garage · Particular</p>
        <h1 className="mt-3 text-4xl font-black leading-tight">Tu historial mecánico, listo para decidir mejor</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
          Cargá services, reparaciones, inspecciones y transferencias con contexto real para tener trazabilidad útil cuando
          importa.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {canAddVehicle ? (
            <Button asChild>
              <Link href="/particular#owner-add-vehicle">
              Registrar vehículo
              </Link>
            </Button>
          ) : (
            <Button disabled>Límite de plan gratuito alcanzado</Button>
          )}
          <Button asChild variant="outline">
            <Link href="/vehiculos">Explorar galería</Link>
          </Button>
        </div>
        <p className="mt-3 text-xs text-slate-300/90">
          Plan Particular gratuito: 1 vehículo. Próximamente: plan Premium para gestionar múltiples unidades.
        </p>
      </Card>

      {canAddVehicle ? (
        <Card id="owner-add-vehicle" className="surface-card space-y-4 rounded-3xl p-6">
          <h2 className="text-xl font-semibold">Agregar tu vehículo</h2>
          <p className="text-sm text-slate-300">
            Lo cargás una vez y después registrás todos los eventos desde la card del auto.
          </p>
          <GarageAddVehicleInline endpoint="/api/vehicles" />
        </Card>
      ) : null}

      {vehiclesWithImage.length === 0 ? (
        <Card className="surface-card rounded-3xl p-6">
          <h2 className="text-xl font-semibold">Todavía no tenés vehículos cargados</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-300">
            Registrá tu auto para empezar a construir un historial verificable con evidencia de service y reparaciones.
          </p>
        </Card>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {vehiclesWithImage.map(({ vehicle, imageUrl }) => (
          <GarageVehicleCard
            key={vehicle.id}
            id={vehicle.id}
            make={vehicle.make}
            model={vehicle.model}
            year={vehicle.year}
            plate={vehicle.plate}
            imageUrl={imageUrl}
            badges={vehicle.badges}
            eventsCount={vehicle.events.length}
            verifiedCount={vehicle.events.filter((event) => event.verificationStatus === "VERIFIED").length}
            lastEventTitle={vehicle.events[0]?.title}
            lastEventDate={
              vehicle.events[0]
                ? `${new Date(vehicle.events[0].occurredAt).toLocaleDateString("es-UY")} · ${vehicle.events.length} eventos recientes`
                : undefined
            }
            noEventsCopy="Cargá tu primer servicio para iniciar historial verificable."
          />
        ))}
      </section>
    </div>
  );
}
