import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { EventTimeline } from "@/components/vehicle/timeline";
import { BadgePills } from "@/components/vehicle/badge-pills";

export default async function PublicVehiclePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const link = await prisma.vehicleAccessLink.findUnique({
    where: { token },
    include: {
      vehicle: {
        include: {
          badges: true,
          events: {
            orderBy: { occurredAt: "desc" }
          }
        }
      }
    }
  });

  if (!link || link.revokedAt || (link.expiresAt && link.expiresAt < new Date())) return notFound();

  const vehicle = link.vehicle;

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-semibold">
          {vehicle.make} {vehicle.model} ({vehicle.year})
        </h1>
        <p className="text-sm text-muted-foreground">Matrícula: {vehicle.plate || "Sin dato"}</p>
        <div className="mt-3">
          <BadgePills badges={vehicle.badges} />
        </div>
      </Card>

      <Card>
        <div className="mb-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
          Este historial puede incluir eventos autodeclarados y verificados. Revisá siempre origen y evidencia.
        </div>
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
            needsClarification: event.needsClarification
          }))}
        />
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Alcances y límites</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Esto no reemplaza inspección mecánica profesional.</li>
          <li>Puede haber períodos sin eventos registrados.</li>
          <li>Próximamente: verificación con talleres y aseguradoras.</li>
        </ul>
      </Card>
    </div>
  );
}
