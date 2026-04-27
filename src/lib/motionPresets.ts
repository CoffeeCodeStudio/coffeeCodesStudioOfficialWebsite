/**
 * Shared scroll/in-view animation tokens.
 *
 * Tighter padding between sections means small motion offsets read better than
 * large ones — a 40px translate looks like a "jump" when sections are close,
 * while ~12-16px feels natural. Keep durations short and trigger early via a
 * negative viewport margin so content has settled before the user reads it.
 *
 * Use these instead of hand-tuned `initial` / `whileInView` props in sections.
 */

export const inViewOnce = { once: true, margin: '-80px' } as const;

/** Standard fade-up for headers / blocks. */
export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: inViewOnce,
  transition: { duration: 0.45, ease: 'easeOut' as const },
};

/** Slightly larger lift for cards inside grids. */
export const fadeUpCard = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: inViewOnce,
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

/** Returns a staggered card variant — pass the index. */
export function staggeredFadeUp(index: number, baseDelay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: inViewOnce,
    transition: { duration: 0.5, delay: baseDelay + index * 0.08, ease: 'easeOut' as const },
  };
}

/** Horizontal slide for two-column splits (e.g. About). */
export const fadeInLeft = {
  initial: { opacity: 0, x: -24 },
  whileInView: { opacity: 1, x: 0 },
  viewport: inViewOnce,
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 24 },
  whileInView: { opacity: 1, x: 0 },
  viewport: inViewOnce,
  transition: { duration: 0.5, delay: 0.1, ease: 'easeOut' as const },
};
