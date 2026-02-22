import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventTimeline } from "@/components/vehicle/timeline";
import { BadgePills } from "@/components/vehicle/badge-pills";
import { QrShareCard } from "@/components/vehicle/qr-modal";
import { EventManagementList } from "@/components/vehicle/event-management-list";

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
      ownerships: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              role: true,
              dealerProfile: { select: { dealerName: true } }
            }
          }
        },
        orderBy: { startedAt: "desc" }
      },
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
  const transfersCount = Math.max(vehicle.ownerships.length - 1, 0);
  const canSeeOwnerIdentity = isOwner || session?.user?.role === "ADMIN";
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
        <p className="mt-3 text-xs text-muted-foreground">
          Transferencias registradas en la plataforma: {transfersCount}
        </p>

        <div className="mt-4">
          <BadgePills badges={vehicle.badges} showLegend />
        </div>
      </Card>

      {isOwner ? <QrShareCard vehicleId={vehicle.id} /> : null}

      <Card>
        <h2 className="text-lg font-semibold">Historial de transferencias</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Esta sección muestra solo transferencias realizadas dentro de Kilómetro Claro.
        </p>
        <div className="mt-4 space-y-3">
          {vehicle.ownerships.map((ownership, index) => {
            const ownerRole = ownership.user.role === "DEALER" ? "Automotora" : "Particular";
            const isCurrent = ownership.ownershipStatus === "CURRENT";
            const ownerName = canSeeOwnerIdentity
              ? ownership.user.dealerProfile?.dealerName || ownership.user.name || ownership.user.email || "Usuario registrado"
              : `${ownerRole} registrado`;

            return (
              <div key={ownership.id} className="rounded-xl border bg-muted/40 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{ownerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {isCurrent ? "Titular actual" : `Titular anterior #${Math.max(vehicle.ownerships.length - index - 1, 1)}`}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{ownerRole}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Desde {new Date(ownership.startedAt).toLocaleDateString("es-UY")}
                  {ownership.endedAt ? ` hasta ${new Date(ownership.endedAt).toLocaleDateString("es-UY")}` : " hasta hoy"}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

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

      {isOwner ? (
        <Card>
          <h2 className="text-lg font-semibold">Gestionar eventos</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Podés borrar eventos cargados por error. Esta acción es permanente.
          </p>
          <div className="mt-4">
            <EventManagementList
              vehicleId={vehicle.id}
              events={vehicle.events.map((event) => ({
                id: event.id,
                title: event.title,
                type: event.type,
                occurredAt: event.occurredAt.toISOString(),
                sourceKind: event.sourceKind
              }))}
            />
          </div>
        </Card>
      ) : null}

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
