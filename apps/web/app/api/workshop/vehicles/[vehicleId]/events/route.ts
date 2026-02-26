import { AccessGrantStatus, Role } from "@prisma/client";
import { createEventSchema } from "@hdv/shared";
import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { ensureWorkshopUser } from "@/lib/workshop-access";
import { storeFile } from "@/lib/storage";
import { commitEventToLedger } from "@/lib/ledger/service";
import { syncVehicleBadges } from "@/lib/badge-service";

const MAX_FILES = 6;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "application/pdf"]);

export async function POST(req: Request, { params }: { params: Promise<{ vehicleId: string }> }) {
  const session = await requireAuth();
  requireRole(Role.WORKSHOP, session.user?.role);
  const { vehicleId } = await params;

  const workshop = await ensureWorkshopUser(session.user!.id);
  if (!workshop?.profile) {
    return NextResponse.json({ error: "Completá el perfil del taller primero." }, { status: 400 });
  }

  const activeGrant = await prisma.vehicleAccessGrant.findFirst({
    where: {
      workshopId: workshop.profile.id,
      vehicleId,
      status: AccessGrantStatus.ACTIVE
    },
    orderBy: { createdAt: "desc" }
  });

  if (!activeGrant) {
    return NextResponse.json({ error: "No tenés autorización activa para este vehículo." }, { status: 403 });
  }

  const formData = await req.formData();
  const dataText = formData.get("data");
  if (typeof dataText !== "string") {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const parsed = createEventSchema.safeParse({
    ...JSON.parse(dataText),
    sourceKind: "WORKSHOP_ENTERED"
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const files = formData.getAll("files").filter((item): item is File => item instanceof File);

  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `Máximo ${MAX_FILES} archivos por evento.` }, { status: 400 });
  }

  for (const file of files) {
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({ error: "Solo se permiten archivos JPG, PNG o PDF." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "Cada archivo debe ser menor o igual a 10MB." }, { status: 400 });
    }
  }

  const event = await prisma.event.create({
    data: {
      vehicleId,
      type: parsed.data.type,
      occurredAt: new Date(parsed.data.occurredAt),
      odometerKm: parsed.data.odometerKm ?? null,
      title: parsed.data.title,
      description: parsed.data.description,
      cost: parsed.data.cost ?? null,
      location: parsed.data.location,
      createdByUserId: session.user!.id,
      createdByRole: "WORKSHOP",
      workshopId: workshop.profile.id,
      consentGrantId: activeGrant.id,
      sourceKind: "WORKSHOP_ENTERED",
      verificationStatus: parsed.data.verificationStatus,
      correctionOfEventId: parsed.data.correctionOfEventId ?? null
    }
  });

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
  await syncVehicleBadges(vehicleId);

  return NextResponse.json({ ok: true, eventId: event.id });
}
