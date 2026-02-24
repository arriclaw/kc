import Link from "next/link";

const productLinks = [
  { href: "/acceso", label: "Particular" },
  { href: "/acceso", label: "Automotora" },
  { href: "/vehiculos", label: "Galería" },
  { href: "/acceso", label: "Panel privado" },
  { href: "/contacto", label: "Contacto" }
];

const trustLinks = [
  { href: "/acceso", label: "Acceso" },
  { href: "/registro", label: "Crear cuenta" },
  { href: "/", label: "Alcances y límites" },
  { href: "/contacto", label: "Hablar con el equipo" }
];

export function SiteFooter() {
  return (
    <footer className="mt-16 px-4 pb-8">
      <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-slate-700/70 bg-slate-900/45 p-6 backdrop-blur-xl">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <div>
            <p className="text-2xl font-black text-white">Kilómetro Claro</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-300">
              Historial vehicular inteligente para construir confianza comercial y bajar incertidumbre.
            </p>
            <div className="mt-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-cyan-100">
              Registro verificable • Datos accionables
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
        <div className="mt-6 border-t border-slate-700/60 pt-4 text-xs text-slate-500">
          © {new Date().getFullYear()} Kilómetro Claro · Uruguay · Transparencia usable
        </div>
      </div>
    </footer>
  );
}
