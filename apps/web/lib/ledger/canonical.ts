import { createHash } from "crypto";

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

function canonicalize(value: Json): Json {
  if (Array.isArray(value)) {
    return value.map((item) => canonicalize(item));
  }
  if (value && typeof value === "object") {
    const sorted = Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = canonicalize((value as Record<string, Json>)[key]);
        return acc;
      }, {} as Record<string, Json>);
    return sorted;
  }
  return value;
}

export function toCanonicalJson(value: Json) {
  return JSON.stringify(canonicalize(value));
}

export function sha256(input: string | Buffer) {
  return createHash("sha256").update(input).digest("hex");
}

export function payloadHash(value: Json) {
  return sha256(toCanonicalJson(value));
}
