import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { vehicleImageUrl } from "@/lib/vehicle-images";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const make = url.searchParams.get("make")?.trim() || "";
  const model = url.searchParams.get("model")?.trim() || "";
  const year = Number(url.searchParams.get("year") || 0);

  const vehicles = await prisma.vehicle.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { plate: { contains: q, mode: "insensitive" } },
                { make: { contains: q, mode: "insensitive" } },
                { model: { contains: q, mode: "insensitive" } }
              ]
            }
          : {},
        make ? { make: { contains: make, mode: "insensitive" } } : {},
        model ? { model: { contains: model, mode: "insensitive" } } : {},
        year ? { year } : {}
      ]
    },
    include: {
      ownerships: {
        where: { ownershipStatus: "CURRENT" },
        orderBy: { startedAt: "desc" },
        take: 1,
        include: {
          user: {
            select: {
              name: true,
              role: true,
              email: true,
              contactEmail: true,
              phone: true,
              whatsapp: true,
              dealerProfile: {
                select: {
                  dealerName: true,
                  phone: true
                }
              }
            }
          }
        }
      },
      events: {
        orderBy: { occurredAt: "desc" },
        take: 8
      },
      badges: true,
      shareLinks: {
        where: { revokedAt: null },
        orderBy: { createdAt: "desc" },
        take: 1
      }
    },
    orderBy: { createdAt: "desc" },
    take: 120
  });

  const payload = await Promise.all(
    vehicles.map(async (vehicle) => ({
      id: vehicle.id,
      plate: vehicle.plate,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      eventsCount: vehicle.events.length,
      verifiedCount: vehicle.events.filter((event) => event.verificationStatus === "VERIFIED").length,
      badges: vehicle.badges,
      publicToken: vehicle.shareLinks[0]?.token || null,
      contact: vehicle.ownerships[0]
        ? {
            ownerType: vehicle.ownerships[0].user.role,
            displayName:
              vehicle.ownerships[0].user.dealerProfile?.dealerName ||
              vehicle.ownerships[0].user.name ||
              "Contacto registrado",
            email: vehicle.ownerships[0].user.contactEmail || vehicle.ownerships[0].user.email,
            phone: vehicle.ownerships[0].user.dealerProfile?.phone || vehicle.ownerships[0].user.phone,
            whatsapp: vehicle.ownerships[0].user.whatsapp || vehicle.ownerships[0].user.phone
          }
        : null,
      imageUrl: await vehicleImageUrl({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year
      })
    }))
  );

  return NextResponse.json(payload);
}
