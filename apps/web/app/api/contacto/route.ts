import { contactMessageSchema } from "@hdv/shared";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`contacto:${ip}`, 5, 60 * 60 * 1000);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Llegaste al límite de envíos por hora. Probá de nuevo en un rato." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contactMessageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const created = await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone || null,
      requesterType: parsed.data.requesterType,
      subject: parsed.data.subject,
      message: parsed.data.message
    },
    select: {
      id: true,
      createdAt: true
    }
  });

  logger.info(
    {
      contactMessageId: created.id,
      requesterType: parsed.data.requesterType,
      ip
    },
    "contact_message_created"
  );

  return NextResponse.json({
    ok: true,
    message: "Recibimos tu mensaje. Te vamos a responder a la brevedad.",
    id: created.id,
    createdAt: created.createdAt.toISOString()
  });
}
