"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

type Item = { href: string; label: string };

export function TopNav() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const isLoggedIn = status === "authenticated" && Boolean(session?.user?.id);

  let items: Item[] = [
    { href: "/vehiculos", label: "Galería" },
    { href: "/contacto", label: "Contacto" }
  ];

  if (isLoggedIn) {
    if (role === "DEALER") {
      items = [
        { href: "/dealer", label: "Mi garage" },
        { href: "/vehiculos", label: "Galería" },
        { href: "/contacto", label: "Contacto" }
      ];
    } else if (role === "ADMIN") {
      items = [
        { href: "/mi-garage", label: "Mi garage" },
        { href: "/dealer", label: "Automotora" },
        { href: "/admin", label: "Admin" },
        { href: "/vehiculos", label: "Galería" },
        { href: "/contacto", label: "Contacto" }
      ];
    } else {
      items = [
        { href: "/mi-garage", label: "Mi garage" },
        { href: "/vehiculos", label: "Galería" },
        { href: "/contacto", label: "Contacto" }
      ];
    }
  }

  return (
    <nav className="flex flex-1 flex-wrap items-center justify-center gap-2">
      {items.map((item) => (
        <Link
          key={`${item.href}-${item.label}`}
          href={item.href}
          className="top-nav-link rounded-full border border-transparent px-4 py-2 text-[13px] font-bold uppercase tracking-[0.11em] text-slate-100 transition hover:border-cyan-300/40 hover:bg-slate-800/70"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
