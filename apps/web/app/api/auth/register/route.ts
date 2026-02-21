import { registerSchema } from "@hdv/shared";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  const isDev = process.env.NODE_ENV !== "production";
  if (existing) {
    if (existing.passwordHash) {
      if (isDev) {
        const passwordHash = await hashPassword(parsed.data.password);
        const updated = await prisma.user.update({
          where: { id: existing.id },
          data: {
            passwordHash,
            name: parsed.data.name || existing.name,
            phone: parsed.data.phone || existing.phone,
            whatsapp: parsed.data.whatsapp || existing.whatsapp,
            contactEmail: parsed.data.contactEmail || existing.contactEmail || email,
            role: existing.role === "ADMIN" ? existing.role : parsed.data.role
          },
          select: {
            id: true,
            email: true,
            role: true,
            name: true
          }
        });

        return NextResponse.json({ ok: true, user: updated, reactivated: true });
      }

      return NextResponse.json(
        { error: "Ya existe un usuario con ese correo. Ingresá con tu contraseña." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        passwordHash,
        name: parsed.data.name || existing.name,
        phone: parsed.data.phone || existing.phone,
        whatsapp: parsed.data.whatsapp || existing.whatsapp,
        contactEmail: parsed.data.contactEmail || existing.contactEmail || email,
        role: existing.role === "ADMIN" ? existing.role : parsed.data.role
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true
      }
    });

    return NextResponse.json({ ok: true, user: updated, activated: true });
  }

  const passwordHash = await hashPassword(parsed.data.password);

  const user = await prisma.user.create({
    data: {
      email,
      contactEmail: parsed.data.contactEmail || email,
      name: parsed.data.name,
      phone: parsed.data.phone,
      whatsapp: parsed.data.whatsapp,
      role: parsed.data.role,
      passwordHash
    },
    select: {
      id: true,
      email: true,
      role: true,
      name: true
    }
  });

  return NextResponse.json({ ok: true, user });
}
