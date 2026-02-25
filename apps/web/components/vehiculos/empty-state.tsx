import { SearchX } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-8 text-center">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/70 text-slate-300">
        <SearchX className="h-5 w-5" />
      </div>
      <p className="mt-3 text-xl font-bold text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-300">{description}</p>
    </div>
  );
}
