/**
 * Vendor-agnostic tracking layer. Events are pushed to `window.dataLayer`
 * (GTM / GA4 compatible) when present and dispatched as a DOM CustomEvent so
 * any future integration (Vercel Analytics, Meta Pixel, CRM) can subscribe
 * without changing call sites.
 */

export interface AnalyticsEvents {
  page_view: { path: string };
  scroll_depth: { percent: 25 | 50 | 75 | 100 };
  product_view: { chapter?: string };
  flavor_view: { flavor: string };
  whatsapp_click: { intent: string; location: string; flavor?: string };
  order_intent: { location: string; flavor?: string };
}

export type AnalyticsEventName = keyof AnalyticsEvents;

export const ANALYTICS_DOM_EVENT = "app:analytics";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track<E extends AnalyticsEventName>(event: E, props: AnalyticsEvents[E]): void {
  if (typeof window === "undefined") return;

  const payload = { event, ...props };
  window.dataLayer?.push(payload);
  window.dispatchEvent(new CustomEvent(ANALYTICS_DOM_EVENT, { detail: payload }));

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", payload);
  }
}
