"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function QrShareCard({ vehicleId }: { vehicleId: string }) {
  const [data, setData] = useState<{ url: string; qrDataUrl: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function createLink() {
    setLoading(true);
    const response = await fetch(`/api/vehicles/${vehicleId}/share-links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility: "FULL_HISTORY" })
    });
    const json = await response.json();
    setData(json);
    setLoading(false);
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold">Compartir historial</h3>
          <p className="text-sm text-muted-foreground">Generá un link público con QR.</p>
        </div>
        <Button onClick={createLink} disabled={loading}>
          {loading ? "Generando..." : "Compartir"}
        </Button>
      </div>
      {data ? (
        <div className="mt-4 space-y-3">
          <Image
            src={data.qrDataUrl}
            alt="QR historial"
            width={160}
            height={160}
            className="h-40 w-40 rounded-lg border"
          />
          <p className="break-all text-xs">{data.url}</p>
          <Button
            variant="outline"
            onClick={() => {
              void navigator.clipboard.writeText(data.url);
            }}
          >
            Copiar link
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
