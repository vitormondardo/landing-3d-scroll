"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query subscription. `serverValue` is used during SSR and
 * hydration, so pick the value that matches the mobile-first default markup.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
