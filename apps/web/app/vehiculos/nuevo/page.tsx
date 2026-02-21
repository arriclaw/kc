import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { AddVehicleForm } from "@/components/vehicle/add-vehicle-form";

export default async function NewVehiclePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/acceso");

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <h1 className="text-2xl font-semibold text-white">Registrar vehículo</h1>
        <p className="mt-2 text-sm text-slate-300">
          Te guiamos paso a paso para crear un historial útil para vos, compradores y automotoras.
        </p>
        <div className="mt-6">
          <AddVehicleForm />
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
            alt="Auto deportivo en entorno urbano"
            width={1200}
            height={800}
            className="h-auto w-full"
          />
        </div>
        <h2 className="text-lg font-semibold text-white">Qué vas a lograr con este alta</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>Base del historial con trazabilidad de origen.</li>
          <li>Disambiguación por matrícula en contexto local.</li>
          <li>Preparado para compartir por link y QR.</li>
        </ul>
      </Card>
    </div>
  );
}
