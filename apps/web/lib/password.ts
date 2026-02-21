import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LEN = 64;
const SEP = ".";

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LEN).toString("hex");
  return `${salt}${SEP}${hash}`;
}

export async function verifyPassword(password: string, hash: string) {
  const [salt, storedHash] = hash.split(SEP);
  if (!salt || !storedHash) return false;
  const hashBuffer = Buffer.from(storedHash, "hex");
  const derived = scryptSync(password, salt, KEY_LEN);
  if (hashBuffer.length !== derived.length) return false;
  return timingSafeEqual(hashBuffer, derived);
}
