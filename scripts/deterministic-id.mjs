/**
 * Pure function extracted from generate-ids.mjs so it can be imported from
 * src/db/seed.ts without pulling in that script's CLI runner — which has a
 * top-level `await import(...)`, and tsx fails to transform a module containing
 * top-level await when it's require()'d into a CJS-mode entry point (seed.ts is
 * run via `tsx src/db/seed.ts` with no "type": "module" in package.json).
 */
import { createHash } from "node:crypto";

/** UUIDv5-shaped id derived from a namespace and a name. */
export function deterministicId(namespace, name) {
  const hash = createHash("sha1").update(`sanaamnis:${namespace}:${name}`).digest();
  const bytes = Buffer.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50; // version 5
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant
  const hex = bytes.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}
