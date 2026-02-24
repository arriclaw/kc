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
    <span className={cn("proof-status-chip", variant === "verified" && "proof-status-chip--verified", variant === "registered" && "proof-status-chip--registered", variant === "declared" && "proof-status-chip--declared")}>
      {variant === "verified" ? <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" /> : <EventStatusIcon variant={variant} />}
      {label}
    </span>
  );
}

export function HeroProofCard({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "proof-card w-full max-w-[21.5rem] rounded-2xl p-3.5",
        className
      )}
    >
      <p className="proof-card-title text-[11px] font-semibold uppercase tracking-[0.14em]">Historial verificable</p>

      <ol className="mt-2.5 space-y-1.5">
        {proofEvents.map((event) => (
          <li key={`${event.title}-${event.meta}`} className="proof-event-row rounded-xl px-2.5 py-2">
            <div className="grid grid-cols-[1fr_auto] items-center gap-2.5">
              <div>
                <p className="proof-event-title text-sm font-semibold">{event.title}</p>
                <p className="proof-event-meta mt-0.5 text-xs">{event.meta}</p>
              </div>
              <StatusChip variant={event.variant} />
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <div className="proof-summary-chip proof-summary-chip--positive rounded-xl px-2.5 py-2 text-xs">
          <p className="font-semibold">Transparencia: Alta</p>
        </div>
        <div className="proof-summary-chip proof-summary-chip--info rounded-xl px-2.5 py-2 text-xs">
          <p className="font-semibold">Riesgo: Bajo</p>
        </div>
      </div>
    </aside>
  );
}
