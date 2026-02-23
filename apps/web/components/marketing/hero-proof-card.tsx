import { BadgeCheck, CircleAlert, CircleDashed, FileCheck2 } from "lucide-react";

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

export function HeroProofCard() {
  return (
    <aside className="glass-panel rounded-2xl border border-slate-600/75 bg-slate-950/72 p-4 backdrop-blur-xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/90">Ejemplo de historial verificable</p>

      <ol className="mt-3 space-y-2.5">
        {proofEvents.map((event) => (
          <li
            key={`${event.title}-${event.date}`}
            className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-100">{event.title}</p>
                <p className="text-xs text-slate-400">{event.date}</p>
              </div>
              <div className="text-right">
                <p className="inline-flex items-center gap-1 text-xs font-semibold text-slate-200">
                  <EventStatusIcon variant={event.variant} />
                  {event.status}
                </p>
                {event.hasEvidence ? (
                  <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-cyan-200/90">
                    <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Evidencia
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-emerald-300/35 bg-emerald-300/10 px-3 py-2 text-xs text-emerald-100">
          <p className="font-semibold">Transparencia: Alta</p>
        </div>
        <div className="rounded-xl border border-cyan-300/35 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100">
          <p className="font-semibold">Riesgo: Bajo</p>
        </div>
      </div>
    </aside>
  );
}
