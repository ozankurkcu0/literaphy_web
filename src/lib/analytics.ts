/** GA4 yüklenmemişse (ölçüm ID'si tanımlı değilse) sessizce no-op olan
 * event gönderici — bkz. Analytics.tsx. */
export function trackEvent(action: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", action, params);
}
