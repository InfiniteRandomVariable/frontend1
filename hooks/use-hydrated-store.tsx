"use client";

import { useHasHydrated } from "@/lib/store";

/**
 * A hook that safely accesses store values that need hydration
 * Returns a default value until the store is hydrated
 */
export function useHydratedStore<T>(selector: () => T, defaultValue: T): T {
  const hasHydrated = useHasHydrated();
  const value = selector();

  return hasHydrated ? value : defaultValue;
}
