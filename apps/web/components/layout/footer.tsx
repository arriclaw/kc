import Link from "next/link";

const productLinks = [
  { href: "/acceso", label: "Particular" },
  { href: "/acceso", label: "Automotora" },
  { href: "/vehiculos", label: "Galería" },
  { href: "/mi-garage", label: "Mi Garage" }
];

const trustLinks = [
  { href: "/registro", label: "Crear cuenta" },
  { href: "/login", label: "Ingresar" },
  { href: "/contacto", label: "Contacto" },
  { href: "/", label: "Alcances y límites" }
];

export function SiteFooter() {
  return (
    <footer className="mt-14 px-4 pb-8">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[2.2rem] border border-slate-700/70 bg-[linear-gradient(130deg,rgba(8,18,42,0.9),rgba(10,22,48,0.82),rgba(8,14,34,0.94))]">
        <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="text-3xl font-black text-white">
              Kilómetro <span className="brand-claro text-amber-300">Claro</span>
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              Plataforma de historial vehicular verificable para operar con menos humo y más contexto accionable.
            </p>
            <div className="mt-5 inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/12 px-3 py-1.5 text-xs font-semibold tracking-[0.1em] text-cyan-100">
              Registro verificable • Evidencia cuando importa • Historial compartible
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/85">Producto</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {productLinks.map((item) => (
                <Link key={`${item.href}-${item.label}`} href={item.href} className="text-slate-300 transition hover:text-cyan-200">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/85">Confianza</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {trustLinks.map((item) => (
                <Link key={`${item.href}-${item.label}`} href={item.href} className="text-slate-300 transition hover:text-cyan-200">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/70 bg-slate-950/35 px-6 py-4 text-xs text-slate-400">
          © {new Date().getFullYear()} Kilómetro Claro · Uruguay · Transparencia usable
        </div>
      </div>
    </footer>
  );
}
