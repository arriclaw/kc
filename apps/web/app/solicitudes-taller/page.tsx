import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { OwnerWorkshopRequests } from "@/components/workshop/owner-workshop-requests";

export default async function SolicitudesTallerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/acceso");
  if (session.user.role !== Role.OWNER && session.user.role !== Role.DEALER && session.user.role !== Role.ADMIN) {
    redirect("/mi-garage");
  }

  const [requests, ownerships] = await Promise.all([
    prisma.vehicleAccessRequest.findMany({
      where: {
        views: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        workshop: {
          select: {
            workshopName: true,
            isVerified: true,
            phone: true,
            address: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.vehicleOwnership.findMany({
      where: {
        userId: session.user.id,
        ownershipStatus: "CURRENT"
      },
      select: {
        vehicleId: true,
        vehicle: {
          select: { plate: true }
        }
      }
    })
  ]);

  const plateToVehicleId = new Map<string, string>();
  for (const ownership of ownerships) {
    const plate = ownership.vehicle.plate?.toUpperCase();
    if (plate) plateToVehicleId.set(plate, ownership.vehicleId);
  }

  const payload = requests.map((request) => ({
    id: request.id,
    plate: request.plate,
    status: request.status,
    createdAt: request.createdAt.toISOString(),
    workshop: request.workshop,
    matchedVehicleId: plateToVehicleId.get(request.plate.toUpperCase()) || null
  }));

  return (
    <div className="space-y-4">
      <Card className="surface-card">
        <h1 className="text-3xl font-black text-[hsl(var(--text))]">Solicitudes de Taller</h1>
        <p className="mt-2 text-sm text-[hsl(var(--muted))]">
          Acá recibís solicitudes nuevas por matrícula. Podés autorizar o rechazar en el momento.
        </p>
      </Card>

      <OwnerWorkshopRequests initialRequests={payload} />
    </div>
  );
}
