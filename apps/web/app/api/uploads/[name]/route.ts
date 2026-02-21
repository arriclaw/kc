import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const filePath = path.join(process.cwd(), "uploads", name);
  try {
    const content = await readFile(filePath);
    return new NextResponse(content, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }
}
