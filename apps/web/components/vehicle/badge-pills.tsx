import { ShieldCheck, Wrench, Clock3, GaugeCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const badgeMap: Record<
  string,
  { label: string; Icon: typeof ShieldCheck; className: string; legend: string }
> = {
  TRANSPARENT_OWNER: {
    label: "Dueño transparente",
    Icon: ShieldCheck,
    className: "border-cyan-300/50 bg-cyan-300/12 text-cyan-100",
    legend: "Tiene historial sostenido en el tiempo"
  },
  MAINTENANCE_STREAK: {
    label: "Mantenimiento al día",
    Icon: Wrench,
    className: "border-emerald-300/50 bg-emerald-300/12 text-emerald-100",
    legend: "Registra servicios periódicos"
  },
  RECENT_SERVICE: {
    label: "Service reciente",
    Icon: Clock3,
    className: "border-indigo-300/50 bg-indigo-300/12 text-indigo-100",
    legend: "Tuvo service en los últimos 90 días"
  },
  LOW_RISK: {
    label: "Riesgo bajo (indicativo)",
    Icon: GaugeCircle,
    className: "border-amber-300/50 bg-amber-300/12 text-amber-100",
    legend: "Sin accidentes registrados y odómetro consistente"
  }
};

export function BadgePills({
  badges,
  showLegend = false
}: {
  badges: Array<{ badgeType: string }>;
  showLegend?: boolean;
}) {
  if (!badges.length) return <p className="text-sm text-slate-300">Sin insignias todavía.</p>;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => {
          const config = badgeMap[badge.badgeType];
          if (!config) return null;
          const Icon = config.Icon;
          return (
            <Badge key={badge.badgeType} className={`inline-flex items-center gap-1.5 ${config.className}`}>
              <Icon className="h-3.5 w-3.5" />
              {config.label}
            </Badge>
          );
        })}
      </div>

      {showLegend ? (
        <div className="grid gap-2 rounded-xl border border-slate-700/70 bg-slate-900/35 p-3 text-xs text-slate-300">
          {badges.map((badge) => {
            const config = badgeMap[badge.badgeType];
            if (!config) return null;
            const Icon = config.Icon;
            return (
              <p key={`${badge.badgeType}-legend`} className="inline-flex items-center gap-2">
                <Icon className="h-3.5 w-3.5" />
                <span className="font-semibold">{config.label}:</span> {config.legend}
              </p>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
