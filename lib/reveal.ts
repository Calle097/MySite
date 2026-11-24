import type { CSSProperties } from 'react';

/**
 * Position in a staggered reveal. Elements that reveal together (rows of a
 * list, the hero's parts) carry their order as --i, and app/lively.css
 * delays each one by that many steps.
 *
 * The reveal itself is opt-in markup: data-reveal="rise" (fades up),
 * "mask" (a heading's [data-line] children rise from behind a clean edge),
 * "rule" (a section title rises out of its own edge) or "frame" (a demo
 * frame's crop marks draw in from the corners). components/RevealObserver.tsx
 * marks each one data-shown as it scrolls into view, in the fancier version
 * only (app/lively/motion.css); plain mode ignores all of it.
 */
export const revealOrder = (i: number) => ({ '--i': i }) as CSSProperties;
