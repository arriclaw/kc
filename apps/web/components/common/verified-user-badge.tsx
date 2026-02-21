import { BadgeCheck } from "lucide-react";

export function VerifiedUserBadge({
  label = "Usuario verificado",
  iconOnly = false
}: {
  label?: string;
  iconOnly?: boolean;
}) {
  if (iconOnly) {
    return (
      <span className="inline-flex items-center text-emerald-300" title={label} aria-label={label}>
        <BadgeCheck className="h-4 w-4" />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/45 bg-emerald-300/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-100">
      <BadgeCheck className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
