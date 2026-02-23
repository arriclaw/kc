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
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none",
        variant === "verified" && "border-emerald-300/40 bg-emerald-950/65 text-emerald-100",
        variant === "registered" && "border-slate-400/55 bg-slate-800/85 text-slate-100",
        variant === "declared" && "border-amber-300/45 bg-amber-950/55 text-amber-100"
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
        "relative w-full max-w-[20.5rem] overflow-hidden rounded-2xl border border-slate-400/65 bg-slate-950/96 p-3.5 shadow-[0_10px_22px_rgba(2,6,23,0.38)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/25 to-slate-950/5" />
      <div className="relative z-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-100">Historial verificable</p>

        <ol className="mt-2.5 space-y-1.5">
          {proofEvents.map((event) => (
            <li
              key={`${event.title}-${event.meta}`}
              className="rounded-xl border border-slate-700/80 bg-slate-900/95 px-2.5 py-2"
            >
              <div className="grid grid-cols-[1fr_auto] items-center gap-2.5">
                <div>
                  <p className="text-sm font-semibold text-slate-50">{event.title}</p>
                  <p className="mt-0.5 text-xs text-slate-300">{event.meta}</p>
                </div>
                <StatusChip variant={event.variant} />
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-600/80 bg-slate-900/82 px-2.5 py-2 text-xs text-slate-100/90">
            <p className="font-semibold">Transparencia: Alta</p>
          </div>
          <div className="rounded-xl border border-slate-600/80 bg-slate-900/82 px-2.5 py-2 text-xs text-slate-100/90">
            <p className="font-semibold">Riesgo: Bajo</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
