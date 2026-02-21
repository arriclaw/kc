import { NextResponse } from "next/server";
import { auditLedgerRange } from "@/lib/ledger/service";
import { getLedgerPublicKey } from "@/lib/ledger/signing";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const from = url.searchParams.get("from") || undefined;
  const to = url.searchParams.get("to") || undefined;

  const report = await auditLedgerRange(from, to);

  return NextResponse.json({
    ...report,
    from,
    to,
    publicKey: getLedgerPublicKey()
  });
}
