"use client";

import { ArrowRightLeft, CheckCircle2, Search, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchUser = {
  id: string;
  role: "OWNER" | "DEALER";
  displayName: string;
  email: string;
};

type Props = {
  vehicleId: string;
  vehicleLabel: string;
  className?: string;
};

function roleLabel(role: SearchUser["role"]) {
  return role === "DEALER" ? "Automotora" : "Particular";
}

export function TransferVehicleAction({ vehicleId, vehicleLabel, className }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchUser[]>([]);
  const [selected, setSelected] = useState<SearchUser | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
        if (!response.ok) {
          setResults([]);
          return;
        }
        const data = (await response.json()) as SearchUser[];
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 260);

    return () => clearTimeout(timeout);
  }, [open, query]);

  const helper = useMemo(() => {
    if (!query.trim()) return "Escribí nombre o email del usuario destino.";
    if (query.trim().length < 2) return "Ingresá al menos 2 caracteres.";
    if (loading) return "Buscando usuarios registrados...";
    if (results.length === 0) return "No encontramos usuarios con ese criterio.";
    return `Seleccioná a quién transferir ${vehicleLabel}.`;
  }, [loading, query, results.length, vehicleLabel]);

  async function submitTransfer() {
    if (!selected || submitting) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: selected.id })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(data?.error || "No se pudo completar la transferencia.");
        return;
      }

      setStatus(`Transferencia realizada a ${selected.displayName}.`);
      setSelected(null);
      setQuery("");
      setResults([]);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={cn("relative inline-flex", className)}>
      <Button size="sm" variant="outline" onClick={() => setOpen((prev) => !prev)} className="w-full">
        <ArrowRightLeft className="mr-1.5 h-4 w-4" />
        Transferir
      </Button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-[min(24rem,calc(100vw-2rem))] space-y-2 rounded-xl border border-slate-700/80 bg-slate-950/95 p-3 shadow-2xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelected(null);
                setStatus(null);
              }}
              placeholder="Buscar usuario para transferir"
              className="pl-9"
            />
          </div>
          <p className="text-xs text-slate-300">{helper}</p>

          {results.length > 0 ? (
            <div className="max-h-44 space-y-1 overflow-y-auto pr-1">
              {results.map((user) => {
                const active = selected?.id === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelected(user)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition ${
                      active
                        ? "border-cyan-300/60 bg-cyan-300/15"
                        : "border-slate-700/70 bg-slate-900/40 hover:border-slate-500"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{user.displayName}</p>
                      <p className="text-xs text-slate-300">{user.email}</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-cyan-200">{roleLabel(user.role)}</span>
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={submitTransfer} disabled={!selected || submitting}>
              {submitting ? "Transfiriendo..." : "Confirmar transferencia"}
            </Button>
            {selected ? (
              <p className="inline-flex items-center text-xs text-slate-200">
                <UserRound className="mr-1 h-3.5 w-3.5" />
                Destino: {selected.displayName}
              </p>
            ) : null}
          </div>

          {status ? (
            <p className="inline-flex items-center text-xs text-cyan-100">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              {status}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
