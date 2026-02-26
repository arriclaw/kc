import Link from "next/link";
import { Role } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventTimeline } from "@/components/vehicle/timeline";

export default async function TallerVehiclePage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/acceso");
  if (session.user.role !== Role.WORKSHOP && session.user.role !== Role.ADMIN) redirect("/mi-garage");

  const { vehicleId } = await params;

  const workshopProfile = await prisma.workshopProfile.findUnique({ where: { userId: session.user.id } });
  if (!workshopProfile) redirect("/taller/onboarding");

  const grant = await prisma.vehicleAccessGrant.findFirst({
    where: {
      workshopId: workshopProfile.id,
      vehicleId,
      status: "ACTIVE"
    }
  });

  if (!grant) return notFound();

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      events: {
        where: { workshopId: workshopProfile.id },
        include: { workshop: { select: { workshopName: true } } },
        orderBy: { occurredAt: "desc" }
      }
    }
  });

  if (!vehicle) return notFound();

  return (
    <div className="space-y-4">
      <Card className="surface-card">
        <h1 className="text-3xl font-black">
          {vehicle.make} {vehicle.model} ({vehicle.year})
        </h1>
        <p className="text-sm text-slate-300">Matrícula: {vehicle.plate || "Sin dato"}</p>
        <div className="mt-4 flex gap-2">
          <Button asChild>
            <Link href={`/taller/vehiculos/${vehicle.id}/evento/nuevo`}>Registrar evento</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/taller">Volver</Link>
          </Button>
        </div>
      </Card>

      <Card className="surface-card">
        <h2 className="text-lg font-semibold">Eventos cargados por este taller</h2>
        <div className="mt-4">
          <EventTimeline
            events={vehicle.events.map((event) => ({
              id: event.id,
              type: event.type,
              occurredAt: event.occurredAt.toISOString(),
              title: event.title,
              description: event.description,
              odometerKm: event.odometerKm,
              sourceKind: event.sourceKind,
              verificationStatus: event.verificationStatus,
              needsClarification: event.needsClarification,
              workshopName: event.workshop?.workshopName ?? null
            }))}
          />
        </div>
      </Card>
    </div>
  );
}
