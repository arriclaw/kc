import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const link = await prisma.vehicleAccessLink.findUnique({
    where: { token },
    include: {
      vehicle: {
        include: {
          badges: true,
          events: {
            include: { attachments: true, workshop: { select: { workshopName: true } } },
            orderBy: { occurredAt: "desc" }
          }
        }
      }
    }
  });

  if (!link || link.revokedAt || (link.expiresAt && link.expiresAt < new Date())) {
    return NextResponse.json({ error: "Link inválido o expirado" }, { status: 404 });
  }

  const vehicle = link.vehicle;
  const events =
    link.visibility === "FULL_HISTORY"
      ? vehicle.events
      : vehicle.events.map((event) => ({
          id: event.id,
          type: event.type,
          occurredAt: event.occurredAt,
          odometerKm: event.odometerKm,
          title: event.title,
          sourceKind: event.sourceKind,
          verificationStatus: event.verificationStatus,
          needsClarification: event.needsClarification,
          workshopName: event.workshop?.workshopName ?? null
        }));

  return NextResponse.json({
    vehicle: {
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate,
      badges: vehicle.badges
    },
    events,
    trustAndLimits: [
      "Esto no reemplaza inspección mecánica.",
      "Eventos pueden estar incompletos si no se registraron.",
      "Próximamente: verificación por talleres/aseguradoras."
    ]
  });
}
