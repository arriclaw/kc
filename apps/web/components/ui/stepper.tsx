import { cn } from "@/lib/utils";

type Step = {
  id: string;
  label: string;
  hint?: string;
};

export function Stepper({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-4">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={step.id}
            className={cn(
              "rounded-2xl border p-3",
              active && "border-cyan-300/60 bg-cyan-300/10 text-cyan-100",
              done && "border-emerald-300/45 bg-emerald-300/10 text-emerald-100",
              !active && !done && "border-slate-700/80 bg-slate-900/45 text-slate-100"
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Paso {index + 1}</p>
            <p className="text-sm font-semibold">{step.label}</p>
            {step.hint ? <p className="mt-1 text-xs text-slate-300">{step.hint}</p> : null}
          </li>
        );
      })}
    </ol>
  );
}
