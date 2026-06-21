const GA_ID = (import.meta.env.VITE_GA_ID as string) || 'G-D61RZN75RT';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function loadGA(): void {
  if (!import.meta.env.PROD) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  } as unknown as (...args: unknown[]) => void;

  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

export function trackPageView(tabId: string, title: string): void {
  if (!import.meta.env.PROD || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_title: title,
    page_path: `/${tabId}`,
    page_location: window.location.href,
  });
}

export function trackEvent(action: string, params?: Record<string, unknown>): void {
  if (!import.meta.env.PROD || typeof window.gtag !== 'function') return;
  window.gtag('event', action, params ?? {});
}
