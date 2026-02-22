import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </section>

      <Skeleton className="h-40 w-full rounded-[2rem]" />
      <Skeleton className="h-28 w-full rounded-2xl" />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-panel rounded-3xl p-5">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="mt-4 h-7 w-44" />
            <Skeleton className="mt-2 h-5 w-28" />
            <Skeleton className="mt-3 h-16 w-full" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
