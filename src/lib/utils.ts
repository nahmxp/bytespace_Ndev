import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * "Design pixel" helper. Hero-style artwork is laid out on a 1440px canvas and
 * scaled with the container (see `.stage` in globals.css). u(120) = 120 design px.
 */
export const u = (n: number) => `calc(var(--u) * ${n})`;

export function formatPrice(n: number) {
  return `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
}

export function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Only allow same-site relative redirects (prevents open-redirect via ?next=). */
export function safeNext(next?: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}
