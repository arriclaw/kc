import { AccessRequestStatus, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAuth();
  if (session.user?.role !== Role.OWNER && session.user?.role !== Role.DEALER && session.user?.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const pending = await prisma.vehicleAccessRequest.count({
    where: {
      status: AccessRequestStatus.PENDING,
      views: {
        some: {
          userId: session.user.id
        }
      }
    }
  });

  return NextResponse.json({ pending });
}
