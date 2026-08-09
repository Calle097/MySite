/**
 * Clock arithmetic, kept out of the components so it can be tested directly.
 * Every bug this file has had was in the carry or the parsing, never in the
 * rendering — see test/time.test.ts.
 */

export const pad = (n: number) => String(n).padStart(2, '0');

/** Hours + minutes → "HH:mm". */
export const formatHHmm = (h: number, m: number) => `${pad(h)}:${pad(m)}`;

/** Minutes since midnight → "HH:mm", wrapping past midnight. */
export const formatMinutes = (mins: number) => `${pad(Math.floor(mins / 60) % 24)}:${pad(mins % 60)}`;

/**
 * Parse "HH:mm", or null if it isn't one.
 *
 * Number.isInteger, not Number.isNaN: isNaN doesn't coerce, so isNaN(undefined)
 * is false and "12" (no colon) used to slip through as { h: 12, m: undefined }
 * and be re-emitted as the string "12:undefined".
 */
export function parseHHmm(v?: string | null): { h: number; m: number } | null {
  if (!v) return null;
  const parts = v.split(':');
  if (parts.length !== 2) return null;
  const [h, m] = parts.map((x) => Number(x.trim()));
  if (!Number.isInteger(h) || !Number.isInteger(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

/**
 * The current time rounded to the nearest `step` minutes.
 *
 * Rounding 58 up to a 5-minute grid gives 60, which is the next hour. Carry it
 * rather than taking % 60, which silently threw the hour away and turned 10:58
 * into 10:00 — and 23:58 into 23:00 rather than midnight.
 */
export function roundToGrid(date: Date, step: number): { h: number; m: number } {
  const rounded = Math.round(date.getMinutes() / step) * step;
  return {
    h: (date.getHours() + Math.floor(rounded / 60)) % 24,
    m: rounded % 60,
  };
}
