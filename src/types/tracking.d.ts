/**
 * Global type declarations for tracking and analytics
 */

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
    gtag: (command: string, action: string, parameters?: Record<string, unknown>) => void;
  }
}

export {};
