import { createPublicKey, generateKeyPairSync, sign, verify } from "crypto";

let privateKeyPem = process.env.LEDGER_PRIVATE_KEY_PEM;

if (!privateKeyPem) {
  const generated = generateKeyPairSync("ed25519");
  privateKeyPem = generated.privateKey.export({ format: "pem", type: "pkcs8" }).toString();
}

const resolvedPrivateKeyPem = privateKeyPem;
const publicKeyPem =
  process.env.LEDGER_PUBLIC_KEY_PEM ||
  createPublicKey(resolvedPrivateKeyPem).export({ format: "pem", type: "spki" }).toString();

export function signEntryHash(entryHash: string): string {
  return sign(null, Buffer.from(entryHash), resolvedPrivateKeyPem).toString("base64");
}

export function verifyEntrySignature(entryHash: string, signature: string, publicKey = publicKeyPem): boolean {
  return verify(null, Buffer.from(entryHash), publicKey, Buffer.from(signature, "base64"));
}

export function getLedgerPublicKey() {
  return publicKeyPem;
}

export function getLedgerKeyId() {
  return process.env.LEDGER_KEY_ID || "local-ed25519-key";
}
