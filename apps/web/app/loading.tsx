import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8 pb-10">
      <section className="home-surface rounded-[2.5rem] border border-slate-700/70 p-5 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-14 w-full max-w-xl" />
            <Skeleton className="h-14 w-4/5 max-w-lg" />
            <Skeleton className="h-6 w-11/12 max-w-xl" />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-40" />
              <Skeleton className="h-11 w-44" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
            </div>
          </div>
          <Skeleton className="h-[380px] w-full rounded-[2rem] sm:h-[440px]" />
        </div>
      </section>

      <section className="home-surface rounded-[2.1rem] border border-slate-700/70 p-4 sm:p-5">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="mt-3 h-6 w-96 max-w-full" />
        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(340px,1fr)]">
          <Skeleton className="h-[520px] w-full rounded-3xl" />
          <div className="grid gap-3">
            <Skeleton className="h-[255px] w-full rounded-2xl" />
            <Skeleton className="h-[255px] w-full rounded-2xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
