"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WorkshopAccessRequestForm() {
  const [plate, setPlate] = useState("");
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approveUrl, setApproveUrl] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/workshop/access-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plate, vin })
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(body?.error || "No se pudo generar la solicitud.");
      setLoading(false);
      return;
    }

    setApproveUrl(body.approveUrl);
    const qr = await QRCode.toDataURL(body.qrData || body.approveUrl, { width: 180, margin: 1 });
    setQrDataUrl(qr);
    setLoading(false);
  }

  return (
    <div className="mt-4 space-y-3">
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <Input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Matrícula" required />
        <Input value={vin} onChange={(e) => setVin(e.target.value)} placeholder="VIN (opcional)" />
        <Button type="submit" disabled={loading || plate.trim().length < 5}>
          {loading ? "Generando..." : "Generar link + QR"}
        </Button>
      </form>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      {approveUrl ? (
        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/35 p-3 text-sm text-slate-200">
          <p className="font-semibold">Link de autorización</p>
          <p className="mt-1 break-all text-xs text-cyan-200">{approveUrl}</p>
          {qrDataUrl ? <img src={qrDataUrl} alt="QR de autorización" className="mt-3 h-36 w-36 rounded-lg border border-slate-600" /> : null}
        </div>
      ) : null}
    </div>
  );
}
