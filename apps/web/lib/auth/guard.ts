import { Role } from "@prisma/client";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  return session;
}

export function requireRole(role: Role, current?: Role) {
  if (current !== role && current !== Role.ADMIN) {
    throw NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }
}
