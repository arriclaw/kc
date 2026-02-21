import { cn } from "@/lib/utils";

export function HighlightCard({
  title,
  body,
  className,
  eyebrow,
  value
}: {
  title: string;
  body: string;
  className?: string;
  eyebrow?: string;
  value?: string;
}) {
  return (
    <article className={cn("glass-panel group relative overflow-hidden rounded-3xl p-6", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-indigo-400/5 opacity-0 transition group-hover:opacity-100" />
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200/85">{eyebrow}</p> : null}
      {value ? <p className="mt-2 text-4xl font-black tracking-tight text-white">{value}</p> : null}
      <h3 className="mt-2 text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{body}</p>
    </article>
  );
}
