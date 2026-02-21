import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { AddEventForm } from "@/components/vehicle/add-event-form";

export default async function NewEventPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/acceso");
  const { id } = await params;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <h1 className="text-2xl font-semibold">Agregar evento al historial</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Flujo guiado para registrar información útil y verificable sin sobrecargar al usuario.
        </p>
        <div className="mt-6">
          <AddEventForm vehicleId={id} />
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <Image
            src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80"
            alt="Mecánico trabajando en mantenimiento de vehículo"
            width={1200}
            height={800}
            className="h-auto w-full"
          />
        </div>
        <h2 className="text-lg font-semibold">Buenas prácticas para eventos</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Títulos claros: “Service 60.000 km” funciona mejor que “Arreglo”.</li>
          <li>Subí evidencia cada vez que puedas para aumentar confianza.</li>
          <li>Si hay error, creá corrección. Nunca se edita el evento original.</li>
        </ul>
      </Card>
    </div>
  );
}
