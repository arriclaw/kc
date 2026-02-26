import { beforeEach, describe, expect, it, vi } from "vitest";
import { AccessRequestStatus, AccessGrantStatus, Role } from "@prisma/client";

type Session = { user: { id: string; role: "OWNER" | "DEALER" | "ADMIN" | "WORKSHOP" } };
type RequestRecord = {
  id: string;
  workshopId: string;
  requestedByUserId: string;
  plate: string;
  vin: string | null;
  tokenHash: string;
  expiresAt: Date;
  status: AccessRequestStatus;
  createdAt: Date;
  respondedAt: Date | null;
  respondedByUserId: string | null;
};
type ViewRecord = { requestId: string; userId: string; createdAt: Date };
type GrantRecord = {
  id: string;
  workshopId: string;
  vehicleId: string;
  requestId: string | null;
  grantedByUserId: string;
  status: AccessGrantStatus;
  createdAt: Date;
  revokedAt: Date | null;
};

const mocks = vi.hoisted(() => {
  const state = {
    session: { user: { id: "workshop-user", role: "WORKSHOP" } } as Session,
    seq: 1,
    users: new Map<string, { id: string; role: "OWNER" | "DEALER" | "ADMIN" | "WORKSHOP" }>(),
    workshopProfiles: new Map<string, { id: string; userId: string; workshopName: string; phone: string | null; address: string | null; isVerified: boolean }>(),
    vehicleOwnerships: [] as Array<{ userId: string; vehicleId: string; ownershipStatus: "CURRENT" | "PAST"; plate: string | null }>,
    requests: [] as RequestRecord[],
    views: [] as ViewRecord[],
    grants: [] as GrantRecord[]
  };

  function nextId(prefix: string) {
    return `${prefix}-${state.seq++}`;
  }

  function requestViews(requestId: string) {
    return state.views.filter((row) => row.requestId === requestId);
  }

  const prisma = {
    user: {
      findUnique: vi.fn(async ({ where }: { where: { id: string } }) => {
        return state.users.get(where.id) || null;
      })
    },
    workshopProfile: {
      findUnique: vi.fn(async ({ where }: { where: { userId: string } }) => {
        return state.workshopProfiles.get(where.userId) || null;
      })
    },
    vehicleOwnership: {
      findMany: vi.fn(async ({ where }: { where: { ownershipStatus?: "CURRENT" | "PAST"; userId?: string; vehicle?: { plate?: { equals: string; mode: "insensitive" } } } }) => {
        const rows = state.vehicleOwnerships.filter((row) => {
          if (where.ownershipStatus && row.ownershipStatus !== where.ownershipStatus) return false;
          if (where.userId && row.userId !== where.userId) return false;
          const plateEq = where.vehicle?.plate?.equals;
          if (plateEq) {
            const plate = row.plate?.toUpperCase() || "";
            if (plate !== plateEq.toUpperCase()) return false;
          }
          return true;
        });

        if (where.userId) {
          return rows.map((row) => ({ vehicleId: row.vehicleId, vehicle: { plate: row.plate } }));
        }
        return rows.map((row) => ({ userId: row.userId }));
      }),
      findFirst: vi.fn(async ({ where }: { where: { userId: string; ownershipStatus: "CURRENT" | "PAST"; vehicle: { plate: { equals: string; mode: "insensitive" } } } }) => {
        const row = state.vehicleOwnerships.find((ownership) => {
          return (
            ownership.userId === where.userId &&
            ownership.ownershipStatus === where.ownershipStatus &&
            (ownership.plate || "").toUpperCase() === where.vehicle.plate.equals.toUpperCase()
          );
        });
        return row ? { vehicleId: row.vehicleId } : null;
      })
    },
    vehicleAccessRequest: {
      create: vi.fn(async ({ data }: { data: { workshopId: string; requestedByUserId: string; plate: string; vin: string | null; tokenHash: string; expiresAt: Date; views: { createMany: { data: Array<{ userId: string }> } } } }) => {
        const request: RequestRecord = {
          id: nextId("req"),
          workshopId: data.workshopId,
          requestedByUserId: data.requestedByUserId,
          plate: data.plate,
          vin: data.vin,
          tokenHash: data.tokenHash,
          expiresAt: data.expiresAt,
          status: AccessRequestStatus.PENDING,
          createdAt: new Date(),
          respondedAt: null,
          respondedByUserId: null
        };
        state.requests.push(request);
        for (const row of data.views.createMany.data) {
          state.views.push({ requestId: request.id, userId: row.userId, createdAt: new Date() });
        }
        return { ...request };
      }),
      findFirst: vi.fn(async ({ where }: { where: { workshopId?: string; plate?: string; status?: AccessRequestStatus; id?: string; views?: { some: { userId: string } } } }) => {
        const found = state.requests.find((request) => {
          if (where.workshopId && request.workshopId !== where.workshopId) return false;
          if (where.plate && request.plate !== where.plate) return false;
          if (where.status && request.status !== where.status) return false;
          if (where.id && request.id !== where.id) return false;
          if (where.views?.some?.userId && !requestViews(request.id).some((view) => view.userId === where.views!.some.userId)) return false;
          return true;
        });
        return found ? { ...found } : null;
      }),
      findMany: vi.fn(
        async ({ where }: { where: { views?: { some: { userId: string } }; status?: AccessRequestStatus } }) => {
          const rows = state.requests.filter((request) => {
            if (where.status && request.status !== where.status) return false;
            if (where.views?.some?.userId && !requestViews(request.id).some((view) => view.userId === where.views!.some.userId)) return false;
            return true;
          });

          return rows.map((request) => ({
            ...request,
            workshop: {
              id: "w-1",
              workshopName: "Taller Norte",
              phone: "099111222",
              address: "Montevideo",
              isVerified: true
            }
          }));
        }
      ),
      count: vi.fn(async ({ where }: { where: { status: AccessRequestStatus; views: { some: { userId: string } } } }) => {
        return state.requests.filter((request) => request.status === where.status && requestViews(request.id).some((view) => view.userId === where.views.some.userId)).length;
      }),
      update: vi.fn(async ({ where, data }: { where: { id: string }; data: Partial<RequestRecord> }) => {
        const idx = state.requests.findIndex((row) => row.id === where.id);
        if (idx === -1) throw new Error("request not found");
        state.requests[idx] = { ...state.requests[idx], ...data };
        return { ...state.requests[idx] };
      })
    },
    vehicleAccessGrant: {
      findFirst: vi.fn(async ({ where }: { where: { workshopId: string; vehicleId: string; status: AccessGrantStatus } }) => {
        const grant = state.grants.find(
          (row) => row.workshopId === where.workshopId && row.vehicleId === where.vehicleId && row.status === where.status
        );
        return grant ? { ...grant } : null;
      }),
      create: vi.fn(
        async ({ data }: { data: { workshopId: string; vehicleId: string; requestId: string; grantedByUserId: string; status: AccessGrantStatus } }) => {
          const grant: GrantRecord = {
            id: nextId("grant"),
            workshopId: data.workshopId,
            vehicleId: data.vehicleId,
            requestId: data.requestId,
            grantedByUserId: data.grantedByUserId,
            status: data.status,
            createdAt: new Date(),
            revokedAt: null
          };
          state.grants.push(grant);
          return { ...grant };
        }
      )
    },
    $transaction: vi.fn(async (cb: (tx: typeof prisma) => Promise<unknown>) => cb(prisma))
  };

  const requireAuth = vi.fn(async () => state.session);
  const requireRole = vi.fn();
  const workshopAccess = {
    ensureWorkshopUser: vi.fn(async (userId: string) => ({
      user: state.users.get(userId)!,
      profile: state.workshopProfiles.get(userId)!
    })),
    createRequestToken: vi.fn(() => ({ tokenHash: `hash-${state.seq}` })),
    nextRequestExpiry: vi.fn(() => new Date(Date.now() + 60_000))
  };

  return { state, prisma, requireAuth, requireRole, workshopAccess };
});

vi.mock("@/lib/prisma", () => ({ prisma: mocks.prisma }));
vi.mock("@/lib/auth/guard", () => ({
  requireAuth: mocks.requireAuth,
  requireRole: mocks.requireRole
}));
vi.mock("@/lib/workshop-access", () => mocks.workshopAccess);

import { GET as getWorkshopCount } from "@/app/api/owner/workshop-requests/count/route";
import { GET as getOwnerRequests } from "@/app/api/owner/workshop-requests/route";
import { POST as createAccessRequest } from "@/app/api/workshop/access-requests/route";
import { POST as approveRequest } from "@/app/api/owner/workshop-requests/[requestId]/approve/route";
import { POST as denyRequest } from "@/app/api/owner/workshop-requests/[requestId]/deny/route";

describe("workshop requests flow", () => {
  beforeEach(() => {
    mocks.state.seq = 1;
    mocks.state.users.clear();
    mocks.state.workshopProfiles.clear();
    mocks.state.vehicleOwnerships = [];
    mocks.state.requests = [];
    mocks.state.views = [];
    mocks.state.grants = [];

    mocks.state.users.set("workshop-user", { id: "workshop-user", role: Role.WORKSHOP });
    mocks.state.users.set("owner-1", { id: "owner-1", role: Role.OWNER });
    mocks.state.users.set("dealer-1", { id: "dealer-1", role: Role.DEALER });
    mocks.state.workshopProfiles.set("workshop-user", {
      id: "workshop-1",
      userId: "workshop-user",
      workshopName: "Taller Norte",
      phone: "099111222",
      address: "Montevideo",
      isVerified: true
    });
    mocks.state.vehicleOwnerships.push(
      { userId: "owner-1", vehicleId: "veh-1", ownershipStatus: "CURRENT", plate: "SAB1234" },
      { userId: "dealer-1", vehicleId: "veh-2", ownershipStatus: "CURRENT", plate: "SAB1234" }
    );
  });

  it("crea solicitud por matrícula y la entrega a bandeja de titulares", async () => {
    mocks.state.session = { user: { id: "workshop-user", role: Role.WORKSHOP } };
    const request = new Request("http://localhost/api/workshop/access-requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plate: "sab1234", reference: "cliente de service" })
    });
    const response = await createAccessRequest(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.recipients).toBe(2);
    expect(mocks.state.requests).toHaveLength(1);
    expect(mocks.state.views.filter((row) => row.requestId === mocks.state.requests[0]!.id)).toHaveLength(2);
  });

  it("lista bandeja del titular y permite aprobar", async () => {
    mocks.state.session = { user: { id: "workshop-user", role: Role.WORKSHOP } };
    await createAccessRequest(
      new Request("http://localhost/api/workshop/access-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plate: "SAB1234" })
      })
    );

    mocks.state.session = { user: { id: "owner-1", role: Role.OWNER } };
    const listResponse = await getOwnerRequests();
    const listBody = await listResponse.json();
    expect(listResponse.status).toBe(200);
    expect(listBody.requests).toHaveLength(1);
    expect(listBody.requests[0].matchedVehicleId).toBe("veh-1");

    const pendingResponse = await getWorkshopCount();
    const pendingBody = await pendingResponse.json();
    expect(pendingBody.pending).toBe(1);

    const requestId = mocks.state.requests[0]!.id;
    const approveResponse = await approveRequest(new Request("http://localhost"), {
      params: Promise.resolve({ requestId })
    });
    const approveBody = await approveResponse.json();
    expect(approveResponse.status).toBe(200);
    expect(approveBody.ok).toBe(true);
    expect(mocks.state.requests[0]!.status).toBe(AccessRequestStatus.APPROVED);
    expect(mocks.state.grants).toHaveLength(1);
    expect(mocks.state.grants[0]!.status).toBe(AccessGrantStatus.ACTIVE);
  });

  it("permite rechazar solicitud desde bandeja", async () => {
    mocks.state.session = { user: { id: "workshop-user", role: Role.WORKSHOP } };
    await createAccessRequest(
      new Request("http://localhost/api/workshop/access-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plate: "SAB1234" })
      })
    );

    mocks.state.session = { user: { id: "dealer-1", role: Role.DEALER } };
    const requestId = mocks.state.requests[0]!.id;
    const denyResponse = await denyRequest(new Request("http://localhost"), {
      params: Promise.resolve({ requestId })
    });
    const denyBody = await denyResponse.json();

    expect(denyResponse.status).toBe(200);
    expect(denyBody.ok).toBe(true);
    expect(mocks.state.requests[0]!.status).toBe(AccessRequestStatus.DENIED);
    expect(mocks.state.grants).toHaveLength(0);
  });
});
