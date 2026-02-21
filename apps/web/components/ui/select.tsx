import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 w-full rounded-xl border border-slate-600/65 bg-slate-900/55 px-3 py-2 text-sm text-slate-100 backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/65",
        props.className
      )}
    />
  );
}
