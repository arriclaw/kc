import { Skeleton } from "@/components/ui/skeleton";

export default function ContactoLoading() {
  return (
    <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-[1.05fr_0.95fr]">
      <div className="glass-panel rounded-[2rem] p-6 sm:p-7">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="mt-4 h-10 w-72 max-w-full" />
        <Skeleton className="mt-3 h-5 w-full" />
        <Skeleton className="mt-2 h-5 w-10/12" />
        <div className="mt-6 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-10 w-44" />
        </div>
      </div>

      <div className="glass-panel rounded-[2rem] p-6 sm:p-7">
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="mt-3 h-5 w-3/4" />
        <div className="mt-5 space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}
