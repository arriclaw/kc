import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2rem] p-6">
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="mt-3 h-5 w-full max-w-3xl" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-panel overflow-hidden rounded-3xl p-0">
            <Skeleton className="h-56 w-full rounded-none" />
            <div className="p-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-8 w-52" />
              <Skeleton className="mt-2 h-5 w-28" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
              <Skeleton className="mt-4 h-10 w-full" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
