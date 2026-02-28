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
              "kc-stepper-item rounded-2xl border p-3",
              active && "kc-stepper-item--active",
              done && "kc-stepper-item--done",
              !active && !done && "kc-stepper-item--idle"
            )}
          >
            <p className="kc-stepper-kicker text-xs font-semibold uppercase tracking-wide">Paso {index + 1}</p>
            <p className="text-sm font-semibold">{step.label}</p>
            {step.hint ? <p className="kc-stepper-hint mt-1 text-xs">{step.hint}</p> : null}
          </li>
        );
      })}
    </ol>
  );
}
