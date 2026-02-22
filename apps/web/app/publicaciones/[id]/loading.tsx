import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-3xl p-6">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-6 w-72 max-w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-6">
        <Skeleton className="h-7 w-48" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </section>
    </div>
  );
}
