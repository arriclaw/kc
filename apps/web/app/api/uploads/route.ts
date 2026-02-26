import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { storeFile } from "@/lib/storage";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "application/pdf"]);

export async function POST(req: Request) {
  await requireAuth();

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: "Solo JPG, PNG o PDF" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "Archivo mayor a 10MB" }, { status: 400 });
  }

  const stored = await storeFile(file);

  return NextResponse.json({
    ok: true,
    file: {
      id: stored.url.split("/").pop(),
      ...stored
    }
  });
}
