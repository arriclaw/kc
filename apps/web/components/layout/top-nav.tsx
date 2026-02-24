"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

export function TopNav() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
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
    <nav className="col-span-2 flex flex-wrap items-center justify-center gap-1.5 lg:col-span-1 lg:justify-center">
      {items.map((item) => (
        <Link
          key={`${item.href}-${item.label}`}
          href={item.href}
          className={`top-nav-link rounded-full border px-3.5 py-2 text-[12px] font-semibold tracking-[0.08em] transition sm:text-[13px] ${
            pathname === item.href
              ? "border-cyan-300/45 bg-cyan-300/15 text-cyan-100"
              : "border-transparent text-slate-100 hover:border-cyan-300/35 hover:bg-slate-800/60"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
