import { transferVehicleSchema } from "@hdv/shared";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { transferVehicleOwnership, VehicleTransferError } from "@/lib/vehicle-transfer";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const { id } = await params;

  const body = await req.json();
  const parsed = transferVehicleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const result = await transferVehicleOwnership({
      vehicleId: id,
      actorUserId: session.user!.id,
      targetUserId: parsed.data.targetUserId
    });

    return NextResponse.json({ ok: true, transferredTo: result.transferredTo, eventId: result.eventId });
  } catch (error) {
    if (error instanceof VehicleTransferError) {
      const statusByCode: Record<VehicleTransferError["code"], number> = {
        SELF_TRANSFER: 400,
        INVALID_TARGET: 404,
        OWNER_LIMIT_REACHED: 409,
        NOT_OWNER_OR_LOCKED: 409
      };
      return NextResponse.json({ error: error.message, code: error.code }, { status: statusByCode[error.code] });
    }

    return NextResponse.json({ error: "No se pudo completar la transferencia." }, { status: 500 });
  }
}
