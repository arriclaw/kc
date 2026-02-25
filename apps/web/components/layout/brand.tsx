import Link from "next/link";

export function BrandMark() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3.5">
      <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-300/45 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.5)]">
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.24),transparent_45%)]" />
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_78%,rgba(56,189,248,0.24),transparent_40%)]" />
        <span className="pointer-events-none absolute left-[7px] top-[12px] h-[2px] w-5 rounded-full bg-emerald-200/70" />
        <span className="pointer-events-none absolute left-[7px] top-[17px] h-[2px] w-3 rounded-full bg-emerald-200/55" />
        <span className="relative inline-flex items-end [font-family:var(--font-exo)]">
          <span className="text-[18px] font-black italic leading-none tracking-[-0.08em] text-[#d1fae5] drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]">
            K
          </span>
          <span className="-ml-1 text-[18px] font-black italic leading-none tracking-[-0.08em] text-[#7dd3fc] drop-shadow-[0_0_10px_rgba(56,189,248,0.45)]">
            C
          </span>
        </span>
        <span className="pointer-events-none absolute bottom-[7px] h-[2px] w-7 rounded-full bg-gradient-to-r from-emerald-200 to-sky-300 opacity-90" />
        <span className="pointer-events-none absolute right-[7px] top-[8px] h-1.5 w-1.5 rounded-full bg-sky-300/90" />
      </span>
      <span className="min-w-0">
        <span className="brand-title block truncate text-[20px] font-black leading-none tracking-[-0.02em] text-slate-100">
          Kilómetro <span className="brand-claro text-emerald-300">Claro</span>
        </span>
        <span className="brand-subtitle mt-0.5 block truncate text-[12px] font-semibold uppercase tracking-[0.14em] text-cyan-200/80 leading-none">
          Historial Vehicular Inteligente
        </span>
      </span>
    </Link>
  );
}
