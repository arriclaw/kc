import { createHash } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export type StoredFile = {
  url: string;
  mimeType: string;
  fileName: string;
  size: number;
  sha256: string;
};

export async function storeFile(file: File): Promise<StoredFile> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const sha256 = createHash("sha256").update(bytes).digest("hex");

  if ((process.env.STORAGE_PROVIDER || "local") === "local") {
    const dir = path.join(process.cwd(), "uploads");
    await mkdir(dir, { recursive: true });
    const safe = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const target = path.join(dir, safe);
    await writeFile(target, bytes);

    return {
      url: `/api/uploads/${safe}`,
      mimeType: file.type || "application/octet-stream",
      fileName: file.name,
      size: bytes.length,
      sha256
    };
  }

  const bucket = process.env.S3_BUCKET || "hdv-mvp";
  return {
    url: `s3://${bucket}/${Date.now()}-${file.name}`,
    mimeType: file.type || "application/octet-stream",
    fileName: file.name,
    size: bytes.length,
    sha256
  };
}
