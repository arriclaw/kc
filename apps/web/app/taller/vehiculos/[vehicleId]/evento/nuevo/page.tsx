import { Role } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { AddEventForm } from "@/components/vehicle/add-event-form";

export default async function TallerNewEventPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/acceso");
  if (session.user.role !== Role.WORKSHOP && session.user.role !== Role.ADMIN) redirect("/mi-garage");

  const { vehicleId } = await params;

  const profile = await prisma.workshopProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) redirect("/taller/onboarding");

  const grant = await prisma.vehicleAccessGrant.findFirst({
    where: {
      workshopId: profile.id,
      vehicleId,
      status: "ACTIVE"
    }
  });

  if (!grant) return notFound();

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) return notFound();

  return (
    <Card className="surface-card space-y-4">
      <h1 className="text-2xl font-bold">
        Nuevo evento de taller · {vehicle.make} {vehicle.model}
      </h1>
      <p className="text-sm text-slate-300">
        Este evento se registra con autorización activa del titular y queda inmutable en el historial.
      </p>
      <AddEventForm
        vehicleId={vehicleId}
        endpoint={`/api/workshop/vehicles/${vehicleId}/events`}
        redirectTo={`/taller/vehiculos/${vehicleId}`}
        lockSourceKind="WORKSHOP_ENTERED"
      />
    </Card>
  );
}
