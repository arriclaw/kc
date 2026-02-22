import Link from "next/link";
import Image from "next/image";
import { FileText, Wrench } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgePills } from "@/components/vehicle/badge-pills";
import { TransferVehicleAction } from "@/components/vehicle/transfer-vehicle-action";
import { DeleteVehicleAction } from "@/components/vehicle/delete-vehicle-action";
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
        <Card className="glass-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Vehículos activos</p>
          <p className="mt-2 text-4xl font-black text-white">{vehicles.length}</p>
        </Card>
        <Card className="glass-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Entradas registradas</p>
          <p className="mt-2 text-4xl font-black text-white">{totalEvents}</p>
        </Card>
        <Card className="glass-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Cobertura verificada</p>
          <p className="mt-2 text-4xl font-black text-white">{trustCoverage}%</p>
        </Card>
      </section>

      <Card className="glass-panel rounded-[2rem] p-6">
        <p className="glass-chip inline-flex text-xs font-semibold uppercase tracking-wide">Perfil Particular</p>
        <h1 className="mt-3 text-3xl font-semibold">Mi Garage y Mantenimiento</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Este panel está pensado para registrar todo lo que le hacés al vehículo durante años: servicio, reparaciones,
          inspecciones, odómetro y evidencia.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {canAddVehicle ? (
            <Button asChild>
              <Link href="/vehiculos/nuevo">Registrar vehículo</Link>
            </Button>
          ) : (
            <Button disabled>Límite de plan gratuito alcanzado</Button>
          )}
          <Button asChild variant="outline">
            <Link href="/vehiculos">Explorar galería</Link>
          </Button>
        </div>
        <p className="mt-3 text-xs text-slate-300">
          Plan Particular gratuito: 1 vehículo. Si necesitás cargar múltiples unidades, usá perfil Automotora.
        </p>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {vehiclesWithImage.map(({ vehicle, imageUrl }) => (
          <Card key={vehicle.id} className="glass-panel rounded-3xl p-5">
            <div className="relative mb-4 h-44 w-full overflow-hidden rounded-2xl border border-slate-700/70">
              <Image src={imageUrl} alt={`${vehicle.make} ${vehicle.model}`} fill className="object-cover" unoptimized />
            </div>
            <h2 className="text-xl font-semibold">
              {vehicle.make} {vehicle.model}
            </h2>
            <p className="text-sm text-slate-300">
              {vehicle.year} · {vehicle.plate || "Sin matrícula"}
            </p>
            <div className="mt-3">
              <BadgePills badges={vehicle.badges} />
            </div>
            <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900/40 p-3 text-sm">
              {vehicle.events[0] ? (
                <>
                  <p className="font-medium">Último registro: {vehicle.events[0].title}</p>
                  <p className="text-slate-300">
                    {new Date(vehicle.events[0].occurredAt).toLocaleDateString("es-UY")} · {vehicle.events.length} eventos recientes
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">Sin registros todavía</p>
                  <p className="text-slate-300">Cargá tu primer servicio para iniciar historial verificable.</p>
                </>
              )}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button asChild size="sm" className="w-full">
                <Link href={`/vehiculos/${vehicle.id}`}>
                  <FileText className="mr-1.5 h-4 w-4" />
                  Historial
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="w-full">
                <Link href={`/vehiculos/${vehicle.id}/eventos/nuevo`}>
                  <Wrench className="mr-1.5 h-4 w-4" />
                  Evento
                </Link>
              </Button>
              <TransferVehicleAction className="w-full" vehicleId={vehicle.id} vehicleLabel={`${vehicle.make} ${vehicle.model}`} />
              <DeleteVehicleAction className="w-full" vehicleId={vehicle.id} vehicleLabel={`${vehicle.make} ${vehicle.model}`} />
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
