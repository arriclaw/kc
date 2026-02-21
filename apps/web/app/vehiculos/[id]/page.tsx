import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventTimeline } from "@/components/vehicle/timeline";
import { BadgePills } from "@/components/vehicle/badge-pills";
import { QrShareCard } from "@/components/vehicle/qr-modal";

function buildTrustScore(params: { events: number; flags: number; verified: number; badges: number }) {
  const eventsScore = Math.min(params.events * 8, 40);
  const verifiedScore = Math.min(params.verified * 10, 30);
  const badgeScore = Math.min(params.badges * 8, 24);
  const penalty = Math.min(params.flags * 12, 30);
  return Math.max(10, Math.min(100, eventsScore + verifiedScore + badgeScore - penalty));
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      badges: true,
      events: {
        include: { attachments: true },
        orderBy: { occurredAt: "desc" }
      },
      flags: {
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!vehicle) return notFound();
  const isOwner = Boolean(
    session?.user?.id &&
      (await prisma.vehicleOwnership.findFirst({
        where: { vehicleId: id, userId: session.user.id, ownershipStatus: "CURRENT" }
      }))
  );

  const verifiedCount = vehicle.events.filter((event) => event.verificationStatus === "VERIFIED").length;
  const trustScore = buildTrustScore({
    events: vehicle.events.length,
    flags: vehicle.flags.length,
    verified: verifiedCount,
    badges: vehicle.badges.length
  });

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </h1>
            <p className="text-sm text-muted-foreground">Matrícula: {vehicle.plate || "Sin dato"}</p>
          </div>
          {isOwner ? (
            <div className="flex gap-2">
              <Button asChild>
                <Link href={`/vehiculos/${vehicle.id}/eventos/nuevo`}>Agregar evento</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/mi-garage">Volver</Link>
              </Button>
            </div>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Índice de confianza (orientativo)</p>
            <p className="text-2xl font-semibold">{trustScore}</p>
          </div>
          <div className="rounded-xl border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Eventos</p>
            <p className="text-2xl font-semibold">{vehicle.events.length}</p>
          </div>
          <div className="rounded-xl border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Verificados</p>
            <p className="text-2xl font-semibold">{verifiedCount}</p>
          </div>
          <div className="rounded-xl border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Flags abiertos</p>
            <p className="text-2xl font-semibold">{vehicle.flags.length}</p>
          </div>
        </div>

        <div className="mt-4">
          <BadgePills badges={vehicle.badges} showLegend />
        </div>
      </Card>

      {isOwner ? <QrShareCard vehicleId={vehicle.id} /> : null}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Timeline de historial</h2>
          <p className="text-xs text-muted-foreground">Mostrar siempre origen + verificación para cada evento</p>
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
        <h3 className="font-semibold">Alcances y límites</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Esto no reemplaza inspección mecánica.</li>
          <li>Eventos pueden estar incompletos si no se registraron.</li>
          <li>Próximamente: verificación por talleres/aseguradoras.</li>
        </ul>
      </Card>
    </div>
  );
}
