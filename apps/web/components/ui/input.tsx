import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-2xl border border-slate-600/65 bg-slate-900/55 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 backdrop-blur ring-offset-background transition-[box-shadow,border-color,background-color] duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/65 focus-visible:border-emerald-300/55 focus-visible:shadow-[0_0_0_4px_rgba(16,185,129,0.18),0_10px_24px_rgba(4,120,87,0.22)] motion-reduce:transition-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
