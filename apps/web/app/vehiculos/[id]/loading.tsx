import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-3xl p-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-6">
        <Skeleton className="h-8 w-56" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </section>
    </div>
  );
}
