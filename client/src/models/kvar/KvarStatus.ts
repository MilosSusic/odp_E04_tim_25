export const ALLOWED_FAULT_STATUSES = [
  "Kreiran",
  "Popravka u toku",
  "Saniran",
  "Problem nije rešen",
] as const;

export type FaultStatus = typeof ALLOWED_FAULT_STATUSES[number];

export function isFaultStatus(x: unknown): x is FaultStatus {
  return typeof x === "string" && (ALLOWED_FAULT_STATUSES as readonly string[]).includes(x);
}
