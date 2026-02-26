"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Item = { href: string; label: string };

export function TopNav() {
  const { data: session, status } = useSession();
  const [pendingWorkshopRequests, setPendingWorkshopRequests] = useState(0);
  const role = session?.user?.role;
  const isLoggedIn = status === "authenticated" && Boolean(session?.user?.id);
  const canSeeWorkshopRequests = role === "OWNER" || role === "DEALER" || role === "ADMIN";

  let items: Item[] = [
    { href: "/vehiculos", label: "Galería" },
    { href: "/contacto", label: "Contacto" }
  ];

  if (isLoggedIn) {
    if (role === "DEALER") {
      items = [
        { href: "/dealer", label: "Mi garage" },
        { href: "/solicitudes-taller", label: "Solicitudes taller" },
        { href: "/vehiculos", label: "Galería" },
        { href: "/contacto", label: "Contacto" }
      ];
    } else if (role === "WORKSHOP") {
      items = [
        { href: "/taller", label: "Mi taller" },
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
        { href: "/solicitudes-taller", label: "Solicitudes taller" },
        { href: "/vehiculos", label: "Galería" },
        { href: "/contacto", label: "Contacto" }
      ];
    }
  }

  useEffect(() => {
    let active = true;
    if (!isLoggedIn || !canSeeWorkshopRequests) {
      setPendingWorkshopRequests(0);
      return;
    }

    const load = async () => {
      const res = await fetch("/api/owner/workshop-requests/count", { cache: "no-store" });
      const body = await res.json().catch(() => ({}));
      if (!active) return;
      setPendingWorkshopRequests(typeof body?.pending === "number" ? body.pending : 0);
    };

    void load();
    const timer = window.setInterval(() => void load(), 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [canSeeWorkshopRequests, isLoggedIn]);

  return (
    <nav className="order-3 flex w-full flex-wrap items-center justify-center gap-1.5 sm:order-none sm:w-auto sm:flex-1 sm:gap-2">
      {items.map((item) => (
        <Link
          key={`${item.href}-${item.label}`}
          href={item.href}
          className="top-nav-link rounded-full border border-transparent px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.09em] text-slate-100 transition hover:border-cyan-300/40 hover:bg-slate-800/70 sm:px-4 sm:py-2 sm:text-[13px] sm:tracking-[0.11em]"
        >
          <span>{item.label}</span>
          {item.href === "/solicitudes-taller" && pendingWorkshopRequests > 0 ? (
            <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-black leading-none text-slate-950">
              {pendingWorkshopRequests}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
