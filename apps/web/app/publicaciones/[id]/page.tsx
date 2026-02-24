import Image from "next/image";
import Link from "next/link";
import { Activity, BadgeCheck, Mail, MessageCircle, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgePills } from "@/components/vehicle/badge-pills";
import { vehicleImageUrl } from "@/lib/vehicle-images";
import { contactLinks } from "@/lib/contact";

export default async function PublicacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
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
              dealerProfile: { select: { dealerName: true, phone: true } }
            }
          }
        }
      },
      events: { orderBy: { occurredAt: "desc" }, take: 20 },
      badges: true,
      shareLinks: { where: { revokedAt: null }, orderBy: { createdAt: "desc" }, take: 1 }
    }
  });

  if (!vehicle) return notFound();

  const ownershipHistory = await prisma.vehicleOwnership.findMany({
    where: { vehicleId: id },
    include: {
      user: {
        select: {
          role: true,
          name: true,
          email: true,
          dealerProfile: { select: { dealerName: true } }
        }
      }
    },
    orderBy: { startedAt: "desc" }
  });

  const publicationImage = await vehicleImageUrl({
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year
  });

  const owner = vehicle.ownerships[0]?.user;
  const ownerContact = owner
    ? {
        ownerType: owner.role,
        displayName: owner.dealerProfile?.dealerName || owner.name || "Contacto registrado",
        email: owner.contactEmail || owner.email,
        phone: owner.dealerProfile?.phone || owner.phone,
        whatsapp: owner.whatsapp || owner.phone
      }
    : null;
  const links = contactLinks(ownerContact || {});

  return (
    <div className="space-y-5">
      <Card className="publication-card overflow-hidden rounded-[2rem] p-0">
        <div className="relative h-[320px] w-full">
          <Image src={publicationImage} alt={`Foto de ${vehicle.make} ${vehicle.model}`} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/16 to-transparent" />
        </div>
        <div className="p-6">
          <h1 className="text-4xl font-black leading-tight text-white">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </h1>
          <p className="mt-1 text-sm text-slate-300">Matrícula: {vehicle.plate || "Sin dato"}</p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <div className="home-mini-chip inline-flex items-center rounded-full border border-slate-500/40 bg-slate-950/45 px-2.5 py-1 text-slate-200">
              <Activity className="mr-1 inline h-3.5 w-3.5 text-cyan-200" />
              Entradas: <span className="ml-1 font-bold text-white">{vehicle.events.length}</span>
            </div>
            <div className="home-mini-chip inline-flex items-center rounded-full border border-slate-500/40 bg-slate-950/45 px-2.5 py-1 text-slate-200">
              <BadgeCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-300" />
              Verificados: <span className="ml-1 font-bold text-white">{vehicle.events.filter((e) => e.verificationStatus === "VERIFIED").length}</span>
            </div>
          </div>

          <div className="mt-3">
            <BadgePills badges={vehicle.badges} showLegend />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <Link href={`/vehiculos/${vehicle.id}`}>Ver ficha interna</Link>
            </Button>
            {vehicle.shareLinks[0]?.token ? (
              <Button asChild variant="outline">
                <Link href={`/publico/${vehicle.shareLinks[0].token}`}>Ver historial compartido</Link>
              </Button>
            ) : null}
          </div>

          {ownerContact ? (
            <div className="mt-4 rounded-2xl border border-slate-700/70 bg-slate-900/35 p-4">
              <p className="text-xs uppercase tracking-[0.13em] text-cyan-200/80">
                {ownerContact.ownerType === "DEALER" ? "Contacto de automotora" : "Contacto de particular"}
              </p>
              <p className="text-lg font-bold text-white">{ownerContact.displayName}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {links.whatsappHref ? (
                  <Button asChild size="sm" variant="outline">
                    <a href={links.whatsappHref} target="_blank" rel="noreferrer">
                      <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                  </Button>
                ) : null}
                {links.phoneHref ? (
                  <Button asChild size="sm" variant="outline">
                    <a href={links.phoneHref}>
                      <Phone className="mr-1.5 h-3.5 w-3.5" />
                      Llamar
                    </a>
                  </Button>
                ) : null}
                {links.emailHref ? (
                  <Button asChild size="sm" variant="outline">
                    <a href={links.emailHref}>
                      <Mail className="mr-1.5 h-3.5 w-3.5" />
                      Mail
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="surface-card">
        <h2 className="text-xl font-bold">Historial de titularidad en la plataforma</h2>
        <p className="mt-1 text-xs text-slate-400">Se muestran solo transferencias realizadas dentro de Kilómetro Claro.</p>
        <div className="mt-4 space-y-2 text-sm">
          {ownershipHistory.map((ownership, index) => {
            const isCurrent = ownership.ownershipStatus === "CURRENT";
            const ownerType = ownership.user.role === "DEALER" ? "Automotora" : "Particular";
            const label = isCurrent
              ? ownerContact?.displayName || "Titular actual"
              : `${ownerType} registrado${index > 0 ? ` #${ownershipHistory.length - index}` : ""}`;

            return (
              <div key={ownership.id} className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-3">
                <p className="font-semibold text-white">{label}</p>
                <p className="text-xs text-slate-400">
                  Desde {new Date(ownership.startedAt).toLocaleDateString("es-UY")}
                  {ownership.endedAt ? ` hasta ${new Date(ownership.endedAt).toLocaleDateString("es-UY")}` : " hasta hoy"}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
