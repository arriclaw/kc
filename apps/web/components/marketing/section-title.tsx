export function SectionTitle({
  kicker,
  title,
  body
}: {
  kicker?: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-2xl space-y-3">
      {kicker ? <p className="glass-chip inline-flex text-xs font-semibold uppercase tracking-[0.18em]">{kicker}</p> : null}
      <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h2>
      {body ? <p className="text-sm text-slate-300 sm:text-base">{body}</p> : null}
    </div>
  );
}
