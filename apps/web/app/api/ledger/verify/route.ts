import { NextResponse } from "next/server";
import { verifyEventInLedger } from "@/lib/ledger/service";
import { getLedgerPublicKey } from "@/lib/ledger/signing";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const eventId = url.searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.json({ error: "Falta eventId" }, { status: 400 });
  }

  const result = await verifyEventInLedger(eventId);
  return NextResponse.json({ ...result, publicKey: getLedgerPublicKey() });
}
