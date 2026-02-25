export function VehicleGridSkeleton() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Cargando vehículos">
      {Array.from({ length: 6 }).map((_, index) => (
        <article key={index} className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-4">
          <div className="kc-skeleton h-44 rounded-xl" />
          <div className="mt-4 space-y-2">
            <div className="kc-skeleton h-4 w-20 rounded" />
            <div className="kc-skeleton h-7 w-2/3 rounded" />
            <div className="kc-skeleton h-4 w-1/3 rounded" />
          </div>
          <div className="mt-3 flex gap-2">
            <div className="kc-skeleton h-7 w-28 rounded-full" />
            <div className="kc-skeleton h-7 w-24 rounded-full" />
          </div>
          <div className="mt-4 kc-skeleton h-10 rounded-xl" />
        </article>
      ))}
    </section>
  );
}
