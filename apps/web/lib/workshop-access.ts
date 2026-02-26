import { createHash } from "crypto";
import { AccessRequestStatus, AccessGrantStatus, Role, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { secureToken } from "@/lib/utils";

export const WORKSHOP_REQUEST_TTL_HOURS = Number(process.env.WORKSHOP_REQUEST_TTL_HOURS || 48);

export function hashAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function buildWorkshopApprovalUrl(token: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/autorizar/taller?token=${token}`;
}

export async function ensureWorkshopUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== Role.WORKSHOP) return null;

  const profile = await prisma.workshopProfile.findUnique({ where: { userId } });
  return { user, profile };
}

export async function resolveRequestByToken(token: string) {
  const tokenHash = hashAccessToken(token);
  const request = await prisma.vehicleAccessRequest.findUnique({
    where: { tokenHash },
    include: {
      workshop: { include: { user: { select: { id: true, email: true, name: true } } } },
      views: true
    }
  });
  return request;
}

export function isRequestUsable(status: AccessRequestStatus, expiresAt: Date) {
  return status === AccessRequestStatus.PENDING && expiresAt.getTime() > Date.now();
}

export function vehicleMatchesRequest(vehicle: { plate: string | null; vin: string | null }, request: { plate: string; vin: string | null }) {
  const plateOk = (vehicle.plate || "").trim().toLowerCase() === request.plate.trim().toLowerCase();
  if (!plateOk) return false;
  if (!request.vin) return true;
  if (!vehicle.vin) return false;
  return vehicle.vin.trim().toLowerCase() === request.vin.trim().toLowerCase();
}

export async function findAccessibleVehicleForRequest(params: {
  request: { plate: string; vin: string | null };
  userId: string;
}) {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      ownerships: {
        some: {
          userId: params.userId,
          ownershipStatus: "CURRENT"
        }
      }
    },
    select: { id: true, plate: true, vin: true, make: true, model: true, year: true }
  });

  return vehicles.find((vehicle) => vehicleMatchesRequest(vehicle, params.request)) || null;
}

export async function hasActiveGrant(params: { workshopId: string; vehicleId: string }) {
  const grant = await prisma.vehicleAccessGrant.findFirst({
    where: {
      workshopId: params.workshopId,
      vehicleId: params.vehicleId,
      status: AccessGrantStatus.ACTIVE
    },
    orderBy: { createdAt: "desc" }
  });
  return grant;
}

export async function expirePendingRequest(requestId: string, tx?: Prisma.TransactionClient) {
  const client = tx || prisma;
  return client.vehicleAccessRequest.update({
    where: { id: requestId },
    data: {
      status: AccessRequestStatus.EXPIRED,
      respondedAt: new Date()
    }
  });
}

export function isOwnerOrDealer(user: { role?: Role | null } | null | undefined) {
  return user?.role === Role.OWNER || user?.role === Role.DEALER || user?.role === Role.ADMIN;
}

export function nextRequestExpiry() {
  return new Date(Date.now() + WORKSHOP_REQUEST_TTL_HOURS * 60 * 60 * 1000);
}

export function createRequestToken() {
  const token = secureToken(32);
  return { token, tokenHash: hashAccessToken(token) };
}
