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
    <footer className="mt-16 border-t border-slate-700/70">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-black text-white">Kilómetro Claro</p>
          <p className="mt-2 max-w-xs text-sm text-slate-400">
            Historial vehicular inteligente para construir confianza comercial y bajar incertidumbre.
          </p>
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
      <div className="border-t border-slate-700/60 px-4 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Kilómetro Claro · Uruguay · Transparencia usable
      </div>
    </footer>
  );
}
