import { createShareLinkSchema } from "@hdv/shared";
import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/guard";
import { secureToken } from "@/lib/utils";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const { id } = await params;

  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id,
      ownerships: {
        some: { userId: session.user!.id }
      }
    }
  });

  if (!vehicle) {
    return NextResponse.json({ error: "Sin acceso" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createShareLinkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const link = await prisma.vehicleAccessLink.create({
    data: {
      vehicleId: id,
      token: secureToken(32),
      visibility: parsed.data.visibility,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null
    }
  });

  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${base}/publico/${link.token}`;
  const qrDataUrl = await QRCode.toDataURL(url);

  return NextResponse.json({
    token: link.token,
    url,
    qrDataUrl,
    visibility: link.visibility,
    expiresAt: link.expiresAt
  });
}
