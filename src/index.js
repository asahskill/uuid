import { randomUUID } from "node:crypto";

/** Generate a single UUID v4. */
export function generateUuid() {
  return randomUUID();
}

/** Generate `count` UUID v4 values. */
export function generateUuids(count = 1) {
  if (!Number.isSafeInteger(count) || count < 1) {
    throw new RangeError("count must be a positive safe integer");
  }

  return Array.from({ length: count }, generateUuid);
}
