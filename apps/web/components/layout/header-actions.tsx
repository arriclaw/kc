"use client";

import { signOut, useSession } from "next-auth/react";
import { BadgeCheck, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const roleLabel: Record<string, string> = {
  OWNER: "Particular",
  DEALER: "Automotora",
  ADMIN: "Administrador"
};

export function HeaderActions() {
  const { data: session, status } = useSession();
  const loggedIn = status === "authenticated" && Boolean(session?.user?.id);

  if (!loggedIn) {
    return (
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button asChild size="sm" variant="outline">
          <Link href="/login">Ingresar</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/registro">Crear cuenta</Link>
        </Button>
      </div>
    );
  }

  const role = session?.user?.role ?? "OWNER";

  function handleSignOut() {
    const confirmed = window.confirm("¿Querés cerrar sesión ahora?");
    if (!confirmed) return;
    void signOut({ callbackUrl: "/" });
  }

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <div className="user-meta hidden min-h-[42px] max-w-[240px] rounded-xl px-3 py-1 md:flex md:flex-col md:justify-center">
        <p className="inline-flex items-center gap-1.5 truncate text-sm font-black leading-[1.1]">
          {session?.user?.name || "Usuario"}
          <BadgeCheck className="user-meta-check h-3.5 w-3.5" />
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] leading-[1.1]">{roleLabel[role] || "Usuario"}</p>
      </div>
      <Button size="sm" variant="ghost" onClick={handleSignOut} aria-label="Cerrar sesión" title="Cerrar sesión">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
