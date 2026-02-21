import Link from "next/link";

export function BrandMark() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3">
      <span className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/45 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.5)]">
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.24),transparent_45%)]" />
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_78%,rgba(251,191,36,0.2),transparent_40%)]" />
        <span className="pointer-events-none absolute left-[7px] top-[12px] h-[2px] w-5 rounded-full bg-cyan-200/70" />
        <span className="pointer-events-none absolute left-[7px] top-[17px] h-[2px] w-3 rounded-full bg-cyan-200/55" />
        <span className="relative inline-flex items-end [font-family:var(--font-exo)]">
          <span className="text-[18px] font-black italic leading-none tracking-[-0.08em] text-[#cffafe] drop-shadow-[0_0_8px_rgba(34,211,238,0.35)]">
            K
          </span>
          <span className="-ml-1 text-[18px] font-black italic leading-none tracking-[-0.08em] text-[#fcd34d] drop-shadow-[0_0_10px_rgba(251,191,36,0.45)]">
            C
          </span>
        </span>
        <span className="pointer-events-none absolute bottom-[7px] h-[2px] w-7 rounded-full bg-gradient-to-r from-cyan-200 to-amber-300 opacity-90" />
        <span className="pointer-events-none absolute right-[7px] top-[8px] h-1.5 w-1.5 rounded-full bg-amber-300/90" />
      </span>
      <span>
        <span className="brand-title block text-[19px] md:text-[20px] font-black tracking-[-0.02em] text-slate-100 leading-none">
          Kilómetro <span className="text-amber-300">Claro</span>
        </span>
        <span className="brand-subtitle mt-0.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-cyan-200/80 leading-none">
          Historial Vehicular Inteligente
        </span>
      </span>
    </Link>
  );
}
