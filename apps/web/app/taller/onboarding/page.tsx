"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TallerOnboardingPage() {
  const router = useRouter();
  const [workshopName, setWorkshopName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/workshop/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workshopName, phone, address, logoUrl })
    });

    if (!res.ok) {
      const body = await res.text();
      setError(body || "No se pudo guardar el perfil.");
      setLoading(false);
      return;
    }

    router.push("/taller");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card className="surface-card space-y-4 p-6">
        <h1 className="text-3xl font-black">Perfil de Taller</h1>
        <p className="text-sm text-slate-300">Completá tus datos para empezar a solicitar acceso y registrar mantenimientos.</p>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Nombre del taller</label>
          <Input value={workshopName} onChange={(e) => setWorkshopName(e.target.value)} placeholder="Taller García" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Teléfono</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+598..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Dirección</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Montevideo" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Logo URL (opcional)</label>
          <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
        </div>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <Button onClick={handleSubmit} disabled={loading || workshopName.trim().length < 2}>
          {loading ? "Guardando..." : "Guardar perfil"}
        </Button>
      </Card>
    </div>
  );
}
