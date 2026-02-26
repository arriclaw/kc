"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WorkshopAccessRequestForm() {
  const [plate, setPlate] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const res = await fetch("/api/workshop/access-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plate, reference })
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(body?.error || "No se pudo generar la solicitud.");
      setLoading(false);
      return;
    }

    setSuccessMessage(`Solicitud enviada a bandeja (${body.recipients || 1} destinatario${body.recipients === 1 ? "" : "s"}).`);
    setPlate("");
    setReference("");
    setLoading(false);
  }

  return (
    <div className="mt-4 space-y-3">
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <Input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Matrícula" required />
        <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Referencia (opcional)" />
        <Button type="submit" disabled={loading || plate.trim().length < 5}>
          {loading ? "Enviando..." : "Enviar solicitud"}
        </Button>
      </form>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {successMessage ? <p className="text-sm text-emerald-300">{successMessage}</p> : null}
    </div>
  );
}
