import Link from "next/link";
import Image from "next/image";
import { AccessRequestStatus, AccessGrantStatus, Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { vehicleImageUrl } from "@/lib/vehicle-images";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkshopAccessRequestForm } from "@/components/workshop/access-request-form";

export default async function TallerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/acceso");
  if (session.user.role !== Role.WORKSHOP && session.user.role !== Role.ADMIN) redirect("/mi-garage");

  const profile = await prisma.workshopProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!profile) {
    redirect("/taller/onboarding");
  }

  const [requests, grants] = await Promise.all([
    prisma.vehicleAccessRequest.findMany({
      where: { workshopId: profile.id },
      orderBy: { createdAt: "desc" },
      take: 15
    }),
    prisma.vehicleAccessGrant.findMany({
      where: { workshopId: profile.id, status: AccessGrantStatus.ACTIVE },
      include: {
        vehicle: {
          include: {
            events: {
              where: { workshopId: profile.id },
              orderBy: { occurredAt: "desc" },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })
  ]);

  const vehicles = await Promise.all(
    grants.map(async (grant) => ({
      grantId: grant.id,
      vehicleId: grant.vehicleId,
      plate: grant.vehicle.plate,
      make: grant.vehicle.make,
      model: grant.vehicle.model,
      year: grant.vehicle.year,
      imageUrl: await vehicleImageUrl({ make: grant.vehicle.make, model: grant.vehicle.model, year: grant.vehicle.year }),
      lastWorkshopEvent: grant.vehicle.events[0]?.title
    }))
  );

  const pendingCount = requests.filter((item) => item.status === AccessRequestStatus.PENDING).length;

  return (
    <div className="space-y-6">
      <Card className="surface-card rounded-3xl p-6">
        <p className="glass-chip inline-flex text-xs font-semibold uppercase tracking-[0.16em]">Portal Taller</p>
        <h1 className="mt-3 text-4xl font-black">{profile.workshopName}</h1>
        <p className="mt-2 text-sm text-slate-300">
          Solicitá autorización por matrícula y enviá la solicitud directo a la bandeja del titular para registrar servicios reales.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/taller/onboarding">Editar perfil</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/solicitudes-taller">Solicitudes de Taller</Link>
          </Button>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="metric-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Solicitudes</p>
          <p className="mt-2 text-4xl font-black">{requests.length}</p>
        </Card>
        <Card className="metric-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Pendientes</p>
          <p className="mt-2 text-4xl font-black">{pendingCount}</p>
        </Card>
        <Card className="metric-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Accesos activos</p>
          <p className="mt-2 text-4xl font-black">{vehicles.length}</p>
        </Card>
      </section>

      <Card className="surface-card rounded-3xl p-6">
        <h2 className="text-xl font-bold">Generar solicitud de acceso</h2>
        <p className="mt-2 text-sm text-slate-300">
          El titular (particular o automotora) la verá en sus solicitudes y podrá autorizar o rechazar.
        </p>
        <WorkshopAccessRequestForm />
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.grantId} className="garage-card rounded-3xl p-5">
            <div className="relative mb-4 h-44 w-full overflow-hidden rounded-2xl border border-slate-700/70">
              <Image src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} fill className="object-cover" unoptimized />
            </div>
            <h3 className="text-2xl font-black">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-slate-300">{vehicle.year} · {vehicle.plate || "Sin matrícula"}</p>
            <p className="mt-3 text-xs text-slate-300">Último registro taller: {vehicle.lastWorkshopEvent || "Sin eventos cargados"}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/taller/vehiculos/${vehicle.vehicleId}`}>Ver</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/taller/vehiculos/${vehicle.vehicleId}/evento/nuevo`}>Registrar evento</Link>
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
