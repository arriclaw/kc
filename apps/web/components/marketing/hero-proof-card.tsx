import { BadgeCheck, CircleAlert, CircleDashed, FileCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ProofEvent = {
  title: string;
  date: string;
  status: string;
  variant: "verified" | "registered" | "declared";
  hasEvidence?: boolean;
};

const proofEvents: ProofEvent[] = [
  {
    title: "Service oficial",
    date: "12/2024",
    status: "Verificado",
    variant: "verified",
    hasEvidence: true
  },
  {
    title: "ITV / Inspección",
    date: "08/2024",
    status: "Verificado",
    variant: "verified",
    hasEvidence: true
  },
  {
    title: "Transferencia",
    date: "03/2024",
    status: "Registrada",
    variant: "registered"
  },
  {
    title: "Siniestro menor",
    date: "11/2023",
    status: "Declarado",
    variant: "declared"
  }
];

function EventStatusIcon({ variant }: { variant: ProofEvent["variant"] }) {
  if (variant === "verified") {
    return <BadgeCheck className="h-4 w-4 text-emerald-300" aria-hidden="true" />;
  }
  if (variant === "registered") {
    return <CircleDashed className="h-4 w-4 text-cyan-200" aria-hidden="true" />;
  }
  return <CircleAlert className="h-4 w-4 text-amber-200" aria-hidden="true" />;
}

export function HeroProofCard({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "w-full max-w-[20.5rem] rounded-2xl border border-slate-500/70 bg-slate-950/88 p-3.5 shadow-[0_8px_20px_rgba(2,6,23,0.35)]",
        className
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/85">Ejemplo de historial verificable</p>

      <ol className="mt-2.5 space-y-1.5">
        {proofEvents.map((event) => (
          <li
            key={`${event.title}-${event.date}`}
            className="rounded-xl border border-slate-700/70 bg-slate-900/75 px-2.5 py-2"
          >
            <div className="grid grid-cols-[1fr_auto] items-start gap-2.5">
              <div>
                <p className="text-sm font-semibold text-slate-100">{event.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{event.date}</p>
              </div>
              <div className="text-right leading-none">
                <p className="inline-flex items-center gap-1 text-xs font-semibold text-slate-200">
                  <EventStatusIcon variant={event.variant} />
                  {event.status}
                </p>
                {event.hasEvidence ? (
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-cyan-200/90">
                    <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Evidencia
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-emerald-300/28 bg-emerald-300/8 px-2.5 py-2 text-xs text-emerald-100">
          <p className="font-semibold">Transparencia: Alta</p>
        </div>
        <div className="rounded-xl border border-cyan-300/28 bg-cyan-300/8 px-2.5 py-2 text-xs text-cyan-100">
          <p className="font-semibold">Riesgo: Bajo</p>
        </div>
      </div>
    </aside>
  );
}
