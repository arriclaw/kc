import { createEventSchema } from "@hdv/shared";
import { EventType, VerificationStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/guard";
import { checkRateLimit } from "@/lib/rate-limit";
import { storeFile } from "@/lib/storage";
import { commitEventToLedger } from "@/lib/ledger/service";
import { syncVehicleBadges } from "@/lib/badge-service";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const url = new URL(req.url);
  const typeParam = url.searchParams.get("type");
  const verificationParam = url.searchParams.get("verification");
  const type = typeParam && Object.values(EventType).includes(typeParam as EventType) ? (typeParam as EventType) : undefined;
  const verification =
    verificationParam && Object.values(VerificationStatus).includes(verificationParam as VerificationStatus)
      ? (verificationParam as VerificationStatus)
      : undefined;

  const events = await prisma.event.findMany({
    where: {
      vehicleId: id,
      type: type || undefined,
      verificationStatus: verification || undefined
    },
    include: { attachments: true },
    orderBy: { occurredAt: "desc" }
  });

  return NextResponse.json(events);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const { id } = await params;

  const limit = checkRateLimit(`event:${session.user!.id}`, 10, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Demasiados eventos. Intentá más tarde." }, { status: 429 });
  }

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

  const formData = await req.formData();
  const dataText = formData.get("data");
  if (typeof dataText !== "string") {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const parsed = createEventSchema.safeParse(JSON.parse(dataText));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const lastWithOdometer = await prisma.event.findFirst({
    where: {
      vehicleId: id,
      odometerKm: { not: null }
    },
    orderBy: { occurredAt: "desc" }
  });

  const needsClarification =
    parsed.data.odometerKm !== null &&
    parsed.data.odometerKm !== undefined &&
    !!lastWithOdometer &&
    parsed.data.odometerKm < (lastWithOdometer.odometerKm ?? 0);

  const event = await prisma.event.create({
    data: {
      vehicleId: id,
      type: parsed.data.type,
      occurredAt: new Date(parsed.data.occurredAt),
      odometerKm: parsed.data.odometerKm ?? null,
      title: parsed.data.title,
      description: parsed.data.description,
      cost: parsed.data.cost ?? null,
      location: parsed.data.location,
      createdByUserId: session.user!.id,
      sourceKind: parsed.data.sourceKind,
      verificationStatus: parsed.data.verificationStatus,
      correctionOfEventId: parsed.data.correctionOfEventId ?? null,
      needsClarification
    }
  });

  if (needsClarification) {
    await prisma.flag.create({
      data: {
        vehicleId: id,
        eventId: event.id,
        reason: "Posible rollback de odómetro"
      }
    });
  }

  const files = formData.getAll("files").filter((item): item is File => item instanceof File);

  if (files.length > 0) {
    const attachments = await Promise.all(files.map((file) => storeFile(file)));
    await prisma.attachment.createMany({
      data: attachments.map((att) => ({
        eventId: event.id,
        url: att.url,
        mimeType: att.mimeType,
        fileName: att.fileName,
        size: att.size,
        sha256: att.sha256
      }))
    });
  }

  await commitEventToLedger(event.id);
  await syncVehicleBadges(id);

  return NextResponse.json({ ok: true, eventId: event.id });
}
