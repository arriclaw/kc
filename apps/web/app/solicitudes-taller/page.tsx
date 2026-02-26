import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export default async function SolicitudesTallerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/acceso");
  if (session.user.role !== Role.OWNER && session.user.role !== Role.DEALER && session.user.role !== Role.ADMIN) {
    redirect("/mi-garage");
  }

  const requests = await prisma.vehicleAccessRequest.findMany({
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
  });

  return (
    <div className="space-y-4">
      <Card className="surface-card">
        <h1 className="text-3xl font-black">Solicitudes de Taller</h1>
        <p className="mt-2 text-sm text-slate-300">
          Se listan solicitudes vistas por vos desde links de autorización. Podés responder desde el link recibido.
        </p>
      </Card>

      <div className="space-y-3">
        {requests.map((request) => (
          <Card key={request.id} className="surface-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-cyan-200">{request.workshop.workshopName}</p>
                <h2 className="text-lg font-bold text-white">Matrícula solicitada: {request.plate}</h2>
                <p className="text-sm text-slate-300">Estado: {request.status}</p>
                <p className="text-xs text-slate-400">Creada: {new Date(request.createdAt).toLocaleString("es-UY")}</p>
              </div>
              <div className="text-xs text-slate-400">
                {request.workshop.isVerified ? "Taller verificado" : "Taller no verificado"}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
