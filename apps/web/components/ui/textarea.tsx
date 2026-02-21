import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "min-h-[110px] w-full rounded-xl border border-slate-600/65 bg-slate-900/55 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/65",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
