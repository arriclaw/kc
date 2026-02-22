import { beforeEach, describe, expect, it, vi } from "vitest";

type Role = "OWNER" | "DEALER" | "ADMIN";
type OwnershipStatus = "CURRENT" | "PAST";

type UserRecord = {
  id: string;
  role: Role;
  name: string | null;
  email: string;
  dealerProfile: { dealerName: string } | null;
};

type OwnershipRecord = {
  id: string;
  vehicleId: string;
  userId: string;
  ownershipStatus: OwnershipStatus;
  startedAt: Date;
  endedAt: Date | null;
};

type EventRecord = {
  id: string;
  vehicleId: string;
  title: string;
  description: string;
};

const mocks = vi.hoisted(() => {
  const state = {
    users: new Map<string, UserRecord>(),
    ownerships: [] as OwnershipRecord[],
    events: [] as EventRecord[],
    seq: 1
  };

  function findUser(userId: string) {
    return state.users.get(userId) || null;
  }

  const tx = {
    vehicleOwnership: {
      count: vi.fn(async ({ where }: { where: { userId: string; ownershipStatus: OwnershipStatus } }) => {
        return state.ownerships.filter((row) => row.userId === where.userId && row.ownershipStatus === where.ownershipStatus).length;
      }),
      updateMany: vi.fn(
        async ({ where, data }: { where: { vehicleId: string; userId: string; ownershipStatus: OwnershipStatus }; data: Partial<OwnershipRecord> }) => {
          let count = 0;
          state.ownerships = state.ownerships.map((row) => {
            if (
              row.vehicleId === where.vehicleId &&
              row.userId === where.userId &&
              row.ownershipStatus === where.ownershipStatus
            ) {
              count += 1;
              return {
                ...row,
                ownershipStatus: (data.ownershipStatus as OwnershipStatus) || row.ownershipStatus,
                endedAt: data.endedAt || row.endedAt
              };
            }
            return row;
          });
          return { count };
        }
      ),
      create: vi.fn(async ({ data }: { data: { vehicleId: string; userId: string; ownershipStatus: OwnershipStatus; startedAt: Date } }) => {
        const created: OwnershipRecord = {
          id: `own-${state.seq++}`,
          vehicleId: data.vehicleId,
          userId: data.userId,
          ownershipStatus: data.ownershipStatus,
          startedAt: data.startedAt,
          endedAt: null
        };
        state.ownerships.push(created);
        return created;
      })
    },
    event: {
      create: vi.fn(
        async ({ data }: { data: { vehicleId: string; title: string; description: string } }) => {
          const created: EventRecord = {
            id: `evt-${state.seq++}`,
            vehicleId: data.vehicleId,
            title: data.title,
            description: data.description
          };
          state.events.push(created);
          return { ...created };
        }
      )
    }
  };

  const prisma = {
    user: {
      findUnique: vi.fn(async ({ where }: { where: { id: string } }) => {
        return findUser(where.id);
      })
    },
    vehicleOwnership: {
      findFirst: vi.fn(
        async ({ where }: { where: { vehicleId: string; ownershipStatus: OwnershipStatus } }) => {
          const row = state.ownerships.find(
            (item) => item.vehicleId === where.vehicleId && item.ownershipStatus === where.ownershipStatus
          );
          if (!row) return null;
          const user = findUser(row.userId);
          if (!user) return null;
          return {
            userId: row.userId,
            user: {
              name: user.name,
              email: user.email,
              dealerProfile: user.dealerProfile
            }
          };
        }
      )
    },
    $transaction: vi.fn(async (cb: (client: typeof tx) => Promise<unknown>) => cb(tx))
  };

  const commitEventToLedger = vi.fn(async () => undefined);
  const syncVehicleBadges = vi.fn(async () => undefined);

  return { state, prisma, commitEventToLedger, syncVehicleBadges };
});

vi.mock("@/lib/prisma", () => ({ prisma: mocks.prisma }));
vi.mock("@/lib/ledger/service", () => ({ commitEventToLedger: mocks.commitEventToLedger }));
vi.mock("@/lib/badge-service", () => ({ syncVehicleBadges: mocks.syncVehicleBadges }));

import { transferVehicleOwnership, VehicleTransferError } from "@/lib/vehicle-transfer";

describe("transfer flow e2e", () => {
  beforeEach(() => {
    mocks.state.users.clear();
    mocks.state.ownerships = [];
    mocks.state.events = [];
    mocks.state.seq = 1;
    mocks.commitEventToLedger.mockClear();
    mocks.syncVehicleBadges.mockClear();

    mocks.state.users.set("owner-a", {
      id: "owner-a",
      role: "OWNER",
      name: "Juan",
      email: "juan@example.com",
      dealerProfile: null
    });
    mocks.state.users.set("dealer-b", {
      id: "dealer-b",
      role: "DEALER",
      name: null,
      email: "dealer@example.com",
      dealerProfile: { dealerName: "Automotora Delta" }
    });

    mocks.state.ownerships.push({
      id: "own-initial",
      vehicleId: "veh-1",
      userId: "owner-a",
      ownershipStatus: "CURRENT",
      startedAt: new Date("2026-01-01T00:00:00.000Z"),
      endedAt: null
    });
  });

  it("transfiere titularidad + crea evento automático + sincroniza ledger", async () => {
    const result = await transferVehicleOwnership({
      vehicleId: "veh-1",
      actorUserId: "owner-a",
      targetUserId: "dealer-b"
    });

    expect(result.transferredTo).toBe("Automotora Delta");
    expect(mocks.state.ownerships.filter((row) => row.vehicleId === "veh-1" && row.ownershipStatus === "CURRENT")).toEqual([
      expect.objectContaining({ userId: "dealer-b" })
    ]);

    expect(mocks.state.events).toHaveLength(1);
    expect(mocks.state.events[0]?.title).toBe("Transferencia de titularidad");
    expect(mocks.commitEventToLedger).toHaveBeenCalledWith(mocks.state.events[0]?.id);
    expect(mocks.syncVehicleBadges).toHaveBeenCalledWith("veh-1");
  });

  it("bloquea transferencias paralelas repetidas con lock lógico", async () => {
    const [a, b] = await Promise.allSettled([
      transferVehicleOwnership({ vehicleId: "veh-1", actorUserId: "owner-a", targetUserId: "dealer-b" }),
      transferVehicleOwnership({ vehicleId: "veh-1", actorUserId: "owner-a", targetUserId: "dealer-b" })
    ]);

    const fulfilled = [a, b].filter((item) => item.status === "fulfilled");
    const rejected = [a, b].filter((item) => item.status === "rejected");

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(rejected[0]).toMatchObject({
      reason: expect.objectContaining({ code: "NOT_OWNER_OR_LOCKED" })
    });
    expect(mocks.state.events).toHaveLength(1);
  });

  it("respeta límite de 1 vehículo para destino particular", async () => {
    mocks.state.users.set("owner-c", {
      id: "owner-c",
      role: "OWNER",
      name: "Pedro",
      email: "pedro@example.com",
      dealerProfile: null
    });

    mocks.state.ownerships.push({
      id: "own-owner-c",
      vehicleId: "veh-2",
      userId: "owner-c",
      ownershipStatus: "CURRENT",
      startedAt: new Date("2026-01-10T00:00:00.000Z"),
      endedAt: null
    });

    await expect(
      transferVehicleOwnership({
        vehicleId: "veh-1",
        actorUserId: "owner-a",
        targetUserId: "owner-c"
      })
    ).rejects.toMatchObject({ code: "OWNER_LIMIT_REACHED" } satisfies Partial<VehicleTransferError>);
  });
});
