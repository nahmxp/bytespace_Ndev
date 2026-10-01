import { createHash } from "node:crypto";

export function getMongoUri(): string {
  return (process.env.MONGODB_URI ?? "").trim();
}

export function isDbConfigured(): boolean {
  return /^mongodb(\+srv)?:\/\//.test(getMongoUri());
}

/**
 * Secret used to sign session JWTs.
 * Prefers AUTH_SECRET; otherwise derives one from MONGODB_URI (which already contains a
 * secret password) so the app works out of the box after only setting the DB URI.
 */
export function getAuthSecret(): string {
  const explicit = (process.env.AUTH_SECRET ?? "").trim();
  if (explicit.length >= 16) return explicit;
  const uri = getMongoUri();
  if (uri) return createHash("sha256").update(`bytespace:${uri}`).digest("hex");
  if (process.env.NODE_ENV !== "production") return "dev-only-secret-change-me-please";
  throw new Error("AUTH_SECRET (or MONGODB_URI) must be set to sign sessions.");
}
