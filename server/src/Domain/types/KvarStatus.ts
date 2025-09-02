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

export function normalizeFaultStatus(s: unknown): FaultStatus | null {
  if (isFaultStatus(s)) return s;

  if (typeof s !== "string") return null;
  const v = s.trim().toLowerCase();

  if (v === "kreiran") return "Kreiran";
  if (v === "u toku" || v === "popravka u toku") return "Popravka u toku";
  if (v === "saniran" || v === "popravljeno" || v === "popravljen") return "Saniran";
  if (v === "problem nije resen" || v === "problem nije rešen") return "Problem nije rešen";

  return null;
}

