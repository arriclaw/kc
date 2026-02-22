import { EventType, Role, SourceKind, VerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { commitEventToLedger } from "@/lib/ledger/service";
import { syncVehicleBadges } from "@/lib/badge-service";

export class VehicleTransferError extends Error {
  code: "INVALID_TARGET" | "SELF_TRANSFER" | "NOT_OWNER_OR_LOCKED" | "OWNER_LIMIT_REACHED";

  constructor(code: VehicleTransferError["code"], message: string) {
    super(message);
    this.code = code;
  }
}

function displayName(user: {
  name: string | null;
  email: string;
  dealerProfile?: { dealerName: string } | null;
}) {
  return user.dealerProfile?.dealerName || user.name || user.email;
}

export async function transferVehicleOwnership(params: { vehicleId: string; actorUserId: string; targetUserId: string }) {
  if (params.actorUserId === params.targetUserId) {
    throw new VehicleTransferError("SELF_TRANSFER", "No podés transferirte el vehículo a vos mismo.");
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: params.targetUserId },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
      dealerProfile: { select: { dealerName: true } }
    }
  });

  if (!targetUser || targetUser.role === Role.ADMIN) {
    throw new VehicleTransferError("INVALID_TARGET", "Usuario destino inválido.");
  }

  const currentOwnership = await prisma.vehicleOwnership.findFirst({
    where: {
      vehicleId: params.vehicleId,
      ownershipStatus: "CURRENT"
    },
    select: {
      userId: true,
      user: {
        select: {
          name: true,
          email: true,
          dealerProfile: { select: { dealerName: true } }
        }
      }
    }
  });

  if (!currentOwnership || currentOwnership.userId !== params.actorUserId) {
    throw new VehicleTransferError("NOT_OWNER_OR_LOCKED", "Solo el titular actual puede transferir este vehículo.");
  }

  const now = new Date();
  const fromName = displayName(currentOwnership.user);
  const toName = displayName(targetUser);

  const result = await prisma.$transaction(async (tx) => {
    if (targetUser.role === Role.OWNER) {
      const currentOwned = await tx.vehicleOwnership.count({
        where: {
          userId: targetUser.id,
          ownershipStatus: "CURRENT"
        }
      });

      if (currentOwned >= 1) {
        throw new VehicleTransferError(
          "OWNER_LIMIT_REACHED",
          "Ese usuario particular ya tiene 1 vehículo activo en plan gratuito. Debe pasar a perfil Automotora para recibir más unidades."
        );
      }
    }

    const lock = await tx.vehicleOwnership.updateMany({
      where: {
        vehicleId: params.vehicleId,
        userId: params.actorUserId,
        ownershipStatus: "CURRENT"
      },
      data: {
        ownershipStatus: "PAST",
        endedAt: now
      }
    });

    if (lock.count !== 1) {
      throw new VehicleTransferError(
        "NOT_OWNER_OR_LOCKED",
        "La transferencia ya fue procesada o cambió el titular. Recargá e intentá nuevamente."
      );
    }

    await tx.vehicleOwnership.create({
      data: {
        vehicleId: params.vehicleId,
        userId: targetUser.id,
        ownershipStatus: "CURRENT",
        startedAt: now
      }
    });

    const transferEvent = await tx.event.create({
      data: {
        vehicleId: params.vehicleId,
        type: EventType.OTHER,
        occurredAt: now,
        title: "Transferencia de titularidad",
        description: `Transferencia registrada en plataforma: de ${fromName} a ${toName}.`,
        createdByUserId: params.actorUserId,
        sourceKind: SourceKind.THIRD_PARTY,
        verificationStatus: VerificationStatus.VERIFIED
      }
    });

    return {
      transferredTo: toName,
      eventId: transferEvent.id
    };
  });

  await commitEventToLedger(result.eventId);
  await syncVehicleBadges(params.vehicleId);

  return result;
}
