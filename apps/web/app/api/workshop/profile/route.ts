import { Role } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

const workshopProfileSchema = z.object({
  workshopName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(24).optional().or(z.literal("")),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  logoUrl: z.string().trim().url().optional().or(z.literal(""))
});

export async function GET() {
  const session = await requireAuth();
  requireRole(Role.WORKSHOP, session.user?.role);

  const profile = await prisma.workshopProfile.findUnique({
    where: { userId: session.user!.id }
  });

  return NextResponse.json({ profile });
}

export async function POST(req: Request) {
  const session = await requireAuth();
  requireRole(Role.WORKSHOP, session.user?.role);

  const body = await req.json();
  const parsed = workshopProfileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const profile = await prisma.workshopProfile.upsert({
    where: { userId: session.user!.id },
    update: {
      workshopName: data.workshopName,
      phone: data.phone || null,
      address: data.address || null,
      logoUrl: data.logoUrl || null
    },
    create: {
      userId: session.user!.id,
      workshopName: data.workshopName,
      phone: data.phone || null,
      address: data.address || null,
      logoUrl: data.logoUrl || null
    }
  });

  return NextResponse.json({ ok: true, profile });
}
