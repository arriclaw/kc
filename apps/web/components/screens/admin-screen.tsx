"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FlagItem = { id: string; reason: string; vehicleId: string; eventId?: string; createdAt: string };

export default function AdminPage() {
  const [flags, setFlags] = useState<FlagItem[]>([]);
  const [automotoraId, setAutomotoraId] = useState("");
  const [shareLinkId, setShareLinkId] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/flags")
      .then(async (r) => {
        if (!r.ok) return [];
        const text = await r.text();
        if (!text) return [];
        try {
          return JSON.parse(text) as FlagItem[];
        } catch {
          return [];
        }
      })
      .then((data) => setFlags(data));
  }, []);

  async function verifyDealer() {
    const response = await fetch(`/api/admin/dealers/${automotoraId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: true })
    });
    setStatus(response.ok ? "Automotora verificada." : "No se pudo verificar automotora.");
  }

  async function revokeShareLink() {
    const response = await fetch(`/api/admin/share-links/${shareLinkId}/revoke`, {
      method: "POST"
    });
    setStatus(response.ok ? "Link revocado." : "No se pudo revocar el link.");
  }

  return (
    <div className="space-y-4">
      <Card className="glass-panel">
        <h1 className="text-2xl font-semibold">Centro de Control</h1>
        <p className="mt-2 text-sm text-slate-300">
          Acá administrás la confianza de la plataforma: revisás alertas, validás automotoras y desactivás enlaces
          públicos cuando detectás abuso.
        </p>
        <div className="mt-3 rounded-xl border border-slate-700/70 bg-slate-900/35 p-3 text-sm text-slate-300">
          Flujo sugerido: 1) revisar alertas, 2) verificar automotoras legítimas, 3) revocar enlaces problemáticos.
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="glass-panel">
          <h2 className="text-lg font-semibold">Flags abiertos</h2>
          <p className="mt-1 text-xs text-slate-300">Priorizar inconsistencias de odómetro y evidencia dudosa.</p>
          <div className="mt-3 space-y-2">
            {flags.map((flag) => (
              <div key={flag.id} className="rounded-xl border p-3 text-sm">
                <p className="font-medium">{flag.reason}</p>
                <p className="text-slate-300">Vehículo: {flag.vehicleId}</p>
                <p className="text-slate-300">Fecha: {new Date(flag.createdAt).toLocaleDateString("es-UY")}</p>
              </div>
            ))}
            {flags.length === 0 ? <p className="text-sm text-slate-300">Sin flags por ahora.</p> : null}
          </div>
        </Card>

        <Card className="glass-panel space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Verificar automotora</h2>
            <div className="mt-2 flex gap-2">
              <Input value={automotoraId} onChange={(e) => setAutomotoraId(e.target.value)} placeholder="ID de perfil de automotora" />
              <Button onClick={verifyDealer}>Verificar</Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Revocar link público</h2>
            <div className="mt-2 flex gap-2">
              <Input value={shareLinkId} onChange={(e) => setShareLinkId(e.target.value)} placeholder="ID del enlace" />
              <Button variant="outline" onClick={revokeShareLink}>
                Revocar
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-3 text-sm text-slate-300">
            Recomendación: documentar motivo de moderación para facilitar auditorías futuras.
          </div>

          {status ? <p className="text-sm text-cyan-100">{status}</p> : null}
        </Card>
      </section>
    </div>
  );
}
