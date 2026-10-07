"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvents } from "@/lib/analytics";

const DEPTHS: AnalyticsEvents["scroll_depth"]["percent"][] = [25, 50, 75, 100];

/** page_view on load + scroll_depth milestones (each fired once). */
export function AnalyticsTracker() {
  useEffect(() => {
    track("page_view", { path: window.location.pathname });

    const reached = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const percent = (window.scrollY / max) * 100;
      for (const depth of DEPTHS) {
        if (percent >= depth - 1 && !reached.has(depth)) {
          reached.add(depth);
          track("scroll_depth", { percent: depth });
        }
      }
      if (reached.size === DEPTHS.length) window.removeEventListener("scroll", onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
