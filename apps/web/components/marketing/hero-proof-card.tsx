import { BadgeCheck, CircleAlert, CircleDashed, FileCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ProofEvent = {
  title: string;
  meta: string;
  variant: "verified" | "registered" | "declared";
};

const proofEvents: ProofEvent[] = [
  {
    title: "Service oficial",
    meta: "12/2024",
    variant: "verified"
  },
  {
    title: "ITV / Inspección",
    meta: "08/2024",
    variant: "verified"
  },
  {
    title: "Transferencia",
    meta: "03/2024",
    variant: "registered"
  }
];

function EventStatusIcon({ variant }: { variant: ProofEvent["variant"] }) {
  if (variant === "verified") {
    return <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />;
  }
  if (variant === "registered") {
    return <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />;
  }
  return <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />;
}

function StatusChip({ variant }: { variant: ProofEvent["variant"] }) {
  const label =
    variant === "verified" ? "Verificado · Evidencia" : variant === "registered" ? "Registrada" : "Declarado";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold leading-none",
        variant === "verified" && "border-emerald-300/40 bg-emerald-300/12 text-emerald-100",
        variant === "registered" && "border-slate-500/70 bg-slate-800/70 text-slate-200",
        variant === "declared" && "border-amber-300/45 bg-amber-300/12 text-amber-100"
      )}
    >
      {variant === "verified" ? <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" /> : <EventStatusIcon variant={variant} />}
      {label}
    </span>
  );
}

export function HeroProofCard({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "w-full max-w-[20.5rem] rounded-2xl border border-slate-500/80 bg-slate-950/92 p-3.5 shadow-[0_10px_24px_rgba(2,6,23,0.35)]",
        className
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/85">Ejemplo de historial verificable</p>

      <ol className="mt-2.5 space-y-1.5">
        {proofEvents.map((event) => (
          <li key={`${event.title}-${event.meta}`} className="rounded-xl border border-slate-700/70 bg-slate-900/85 px-2.5 py-2">
            <div className="grid grid-cols-[1fr_auto] items-center gap-2.5">
              <div>
                <p className="text-sm font-semibold text-slate-100">{event.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{event.meta}</p>
              </div>
              <StatusChip variant={event.variant} />
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-emerald-300/25 bg-emerald-300/8 px-2.5 py-2 text-xs text-emerald-100/90">
          <p className="font-semibold">Transparencia: Alta</p>
        </div>
        <div className="rounded-xl border border-cyan-300/25 bg-cyan-300/8 px-2.5 py-2 text-xs text-cyan-100/90">
          <p className="font-semibold">Riesgo: Bajo</p>
        </div>
      </div>
    </aside>
  );
}
