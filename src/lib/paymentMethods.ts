import { trackEvent } from '@/lib/analytics';

/**
 * Single source of truth for which payment methods are currently active.
 * Any method not in this allowlist will be filtered out from the UI and logged.
 *
 * To deactivate a method: remove its key here.
 * To activate a new one: add the key here AND add the translation in LanguageContext.
 */
export const ACTIVE_PAYMENT_METHODS = ['invoice'] as const;

export type ActivePaymentMethod = typeof ACTIVE_PAYMENT_METHODS[number];

/**
 * Explicitly disallowed methods. Used purely for clearer telemetry when a
 * legacy/inactive option leaks into the UI (e.g. stale translation key, bad
 * server response, tampered client state).
 */
const BLOCKED_PAYMENT_METHODS = new Set<string>(['crypto', 'card', 'swish', 'paypal']);

export function isActivePaymentMethod(key: string): key is ActivePaymentMethod {
  return (ACTIVE_PAYMENT_METHODS as readonly string[]).includes(key);
}

/**
 * Filters a list of payment-method candidates down to the active allowlist.
 * Any blocked or unknown method is dropped and reported via analytics +
 * console so we get visibility if "Krypto" or similar ever reappears.
 */
export function filterActivePaymentMethods<T extends { key: string }>(
  candidates: T[],
  context: string,
): T[] {
  const safe: T[] = [];

  for (const item of candidates) {
    if (isActivePaymentMethod(item.key)) {
      safe.push(item);
      continue;
    }

    const reason = BLOCKED_PAYMENT_METHODS.has(item.key)
      ? 'blocked_method'
      : 'unknown_method';

    // eslint-disable-next-line no-console
    console.error(
      `[payment-methods] Inactive payment method "${item.key}" was rendered in "${context}" and has been blocked.`,
    );

    try {
      trackEvent('inactive_payment_method_blocked', {
        method: item.key,
        context,
        reason,
      });
    } catch {
      // analytics must never break the UI
    }
  }

  return safe;
}
